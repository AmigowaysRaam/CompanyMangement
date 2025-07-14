import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { updateContactInfo } from '../redux/authActions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { wp } from '../resources/dimensions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CompanyShiftForm = ({ onNext, cId ,companyDetails}) => {
  const { themeMode } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [shifts, setShifts] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerField, setPickerField] = useState(null);
  const [pickerValue, setPickerValue] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleTimeSelect = (event, selected) => {
    setShowPicker(false);
    if (event.type === 'dismissed') return;
    pickerField?.setter(selected);
  };

  const openTimePicker = (setter, value) => {
    setPickerField({ setter });
    setPickerValue(value);
    setShowPicker(true);
  };

  const addShift = () =>
    setShifts(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        start: new Date(),
        end: new Date(),
        breaks: [],
      },
    ]);

  const removeShift = id => setShifts(prev => prev.filter(s => s.id !== id));

  const addBreak = shiftId =>
    setShifts(prev =>
      prev.map(s =>
        s.id === shiftId
          ? {
            ...s,
            breaks: [
              ...s.breaks,
              {
                id: Date.now(),
                name: '',
                start: new Date(),
                end: new Date(),
              },
            ],
          }
          : s
      )
    );

  const removeBreak = (shiftId, breakId) =>
    setShifts(prev =>
      prev.map(s =>
        s.id === shiftId
          ? {
            ...s,
            breaks: s.breaks.filter(b => b.id !== breakId),
          }
          : s
      )
    );

  const updateShift = (id, field, value) =>
    setShifts(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );

  const updateBreak = (shiftId, breakId, field, value) =>
    setShifts(prev =>
      prev.map(s =>
        s.id === shiftId
          ? {
            ...s,
            breaks: s.breaks.map(b =>
              b.id === breakId ? { ...b, [field]: value } : b
            ),
          }
          : s
      )
    );

  const onSubmit = () => {
    if (!shifts.length) {
      ToastAndroid.show(t('error_no_shift'), ToastAndroid.SHORT);
      return;
    }

    for (const shift of shifts) {
      if (!shift.name.trim()) {
        ToastAndroid.show(t('error_enter_shift_name'), ToastAndroid.SHORT);
        return;
      }
      if (shift.start >= shift.end) {
        ToastAndroid.show(t('error_shift_start_before_end'), ToastAndroid.SHORT);
        return;
      }

      for (const brk of shift.breaks) {
        if (!brk.name.trim()) {
          ToastAndroid.show(t('error_enter_break_name'), ToastAndroid.SHORT);
          return;
        }
        if (brk.start >= brk.end) {
          ToastAndroid.show(t('error_break_start_before_end'), ToastAndroid.SHORT);
          return;
        }
        if (brk.start < shift.start || brk.end > shift.end) {
          ToastAndroid.show(t('error_break_within_shift'), ToastAndroid.SHORT);
          return;
        }
      }
    }
    const payload = {
      _id: cId,
      shifts: shifts.map(s => ({
        shift_name: s.name,
        start_time: s.start,
        end_time: s.end,
        breaks: s.breaks.map(b => ({
          name: b.name,
          break_start: b.start,
          break_end: b.end,
        })),
      })),
    };
    setLoading(true);
    dispatch(
      updateContactInfo(payload, res => {
        if (res)
          setLoading(false);
        ToastAndroid.show(res?.message, ToastAndroid.SHORT);
        if (res.success) onNext();

      })
    );
  };

  useEffect(() => {
    if (companyDetails?.shifts?.length > 0) {
      // map shifts to your local state format
      const loadedShifts = companyDetails.shifts.map((shift, index) => ({
        id: shift._id || index, // unique id for React keys
        name: shift.shift_name || '',
        start: shift.start_time ? new Date(shift.start_time) : new Date(),
        end: shift.end_time ? new Date(shift.end_time) : new Date(),
        breaks: (shift.breaks || []).map((brk, i) => ({
          id: brk._id || i,
          name: brk.name || '',  // if you want break name editable, else ''
          start: brk.break_start ? new Date(brk.break_start) : new Date(),
          end: brk.break_end ? new Date(brk.break_end) : new Date(),
        })),
      }));
      setShifts(loadedShifts);
    }
  }, [companyDetails]);
  

  const renderTimeButton = (label, date, onPress) => (
    <TouchableOpacity style={styles.timeBtn} onPress={onPress}>
      <Text style={styles.timeBtnText}>
        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <Text style={styles.timeLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        // { backgroundColor: themeMode === 'light' ? '#f5f5f5' : '#121212' },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text
          style={[
            styles.header,
            Louis_George_Cafe.bold.h3,
            { color: themeMode === 'light' ? '#000' : '#fff' },
          ]}
        >
          {t('shift_details')}
        </Text>

        <TouchableOpacity style={[styles.addShiftBtn, {
          alignSelf: "flex-end", flexDirection: "row",
        }]} onPress={addShift}>

          <Text style={styles.addShiftText}>{t('add_shift')}</Text>
          <MaterialCommunityIcons
            name={'plus-circle'}
            size={wp(5)}               // smaller icon size
            color={'#007bff'}

          />

        </TouchableOpacity>

        {shifts.map((s, si) => (
          <View
            key={s.id}
            style={[
              styles.card,
              { backgroundColor: themeMode === 'light' ? '#fff' : '#1c1c1c' },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[Louis_George_Cafe.bold.h4, {
                color: THEMECOLORS[themeMode].textPrimary
              }]}>{`${t('shift')} ${si + 1}`}</Text>
              <TouchableOpacity style={[{
                backgroundColor: '#F1F1F1', borderRadius: wp(4), padding: wp(2), flexDirection: 'row'
              }]} onPress={() => removeShift(s.id)}>
                <Text style={styles.removeText}>{t('remove_shift')}</Text>
                <MaterialCommunityIcons
                  name={'close'}
                  size={wp(5)}               // smaller icon size
                  color={'#ff0000'}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor:
                    themeMode === 'light' ? '#fafafa' : '#2d2d2d',
                },
              ]}
              placeholder={t('shift_name')}
              placeholderTextColor="#888"
              value={s.name}
              onChangeText={v => updateShift(s.id, 'name', v)}
            />

            <View style={styles.row}>
              {renderTimeButton(t('start'), s.start, () =>
                openTimePicker(d => updateShift(s.id, 'start', d), s.start)
              )}
              {renderTimeButton(t('end'), s.end, () =>
                openTimePicker(d => updateShift(s.id, 'end', d), s.end)
              )}
            </View>

            <TouchableOpacity
              // style={styles.addBreakBtn}
              style={[{
                backgroundColor: '#F1F1F1', borderRadius: wp(4), padding: wp(2), alignSelf: "flex-end", marginVertical: wp(4), flexDirection: "row",
              }]}
              onPress={() => addBreak(s.id)}
            >
              <Text style={[styles.addBreakText, {
                marginRight: wp(2), color: "#008000"
              }]}>{t('add_break')}</Text>
              <MaterialCommunityIcons
                name={'plus-circle'}
                size={wp(5)}               // smaller icon size
                color={'#008000'}
              />
            </TouchableOpacity>

            {s.breaks.map((b, bi) => (
              <View key={b.id} style={styles.breakCard}>
                <TextInput
                  style={styles.input}
                  placeholder={t('break_name')}
                  value={b.name}
                  onChangeText={v => updateBreak(s.id, b.id, 'name', v)}
                />
                <View style={styles.row}>
                  {renderTimeButton(t('start'), b.start, () =>
                    openTimePicker(
                      d => updateBreak(s.id, b.id, 'start', d),
                      b.start
                    )
                  )}
                  {renderTimeButton(t('end'), b.end, () =>
                    openTimePicker(
                      d => updateBreak(s.id, b.id, 'end', d),
                      b.end
                    )
                  )}
                </View>

                <TouchableOpacity style={[{
                  backgroundColor: '#FFF', borderRadius: wp(4), padding: wp(2), flexDirection: 'row', alignSelf: "flex-end"
                }]}
                  onPress={() => removeBreak(s.id, b.id)}
                >
                  <Text style={styles.removeText}>{t('remove_shift')}</Text>
                  <MaterialCommunityIcons
                    name={'close'}
                    size={wp(5)}               // smaller icon size
                    color={'#ff0000'}
                  />
                </TouchableOpacity>


              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      {shifts.length > 0 &&
        <TouchableOpacity
          style={[styles.submitBtn, {
            backgroundColor: THEMECOLORS[themeMode].buttonBg
          }]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[Louis_George_Cafe.bold.h2, {
              color: THEMECOLORS[themeMode].buttonText
            }]}>{t('submit')}</Text>
          )}
        </TouchableOpacity>}
      {showPicker && (
        <DateTimePicker
          value={pickerValue}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeSelect}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: wp(4) },
  header: { marginBottom: wp(3) },
  card: {
    padding: wp(3),
    borderRadius: wp(2),
    marginBottom: wp(4),
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: wp(4), paddingHorizontal: wp(2), alignItems: "center"
  },
  removeText: { color: 'red', fontSize: 12 },
  input: {
    borderWidth: wp(0.5),
    borderColor: '#ccc',
    borderRadius: wp(3),
    padding: wp(3),
    marginBottom: wp(3),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: wp(3),
  },
  timeBtn: {
    flex: 1,
    padding: wp(3),
    backgroundColor: '#e9e9e9',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: wp(2),
  },
  timeBtnText: { fontSize: 16 },
  timeLabel: { fontSize: 12, color: '#777' },
  addShiftBtn: {
    padding: wp(1),
    backgroundColor: '#007bff33',
    borderRadius: 6,
    marginBottom: wp(3),
    paddingHorizontal: wp(4)
  },
  addShiftText: { color: '#007bff', fontWeight: 'bold', marginRight: wp(3) },
  // addBreakBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  // addBreakText: { color: '#28a745', fontWeight: 'bold' },
  breakCard: {
    padding: wp(2),
    backgroundColor: '#f5f5f5',
    borderRadius: wp(2),
    marginBottom: wp(3),
  },
  submitBtn: {
    // backgroundColor: '#007bff',
    padding: wp(2),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: wp(3),
    marginBottom: wp(4),
    // position: "absolute", bottom: wp(2)
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CompanyShiftForm;
