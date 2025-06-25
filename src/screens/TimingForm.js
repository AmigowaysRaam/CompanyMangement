import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateContactInfo } from '../redux/authActions';
import { useDispatch } from 'react-redux';

const TimingForm = ({ onNext, setCurrentStep, currentStep, cId, companyDetails }) => {
  const { themeMode } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [shiftName, setShiftName] = useState('');
  const [shiftStartTime, setShiftStartTime] = useState(new Date());
  const [shiftEndTime, setShiftEndTime] = useState(new Date());
  const [breakStartTime, setBreakStartTime] = useState(new Date());
  const [breakEndTime, setBreakEndTime] = useState(new Date());
  const [lunchStartTime, setLunchStartTime] = useState(new Date());
  const [lunchEndTime, setLunchEndTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState(null);
  const [timePickerValue, setTimePickerValue] = useState(new Date());

  const dispatch = useDispatch();
  
  useEffect(() => {
    if (companyDetails?.shifts?.length > 0) {
      const shift = companyDetails.shifts[0]; // Assuming only one shift or using the first
  
      setShiftName(shift.shift_name || '');
      setShiftStartTime(new Date(shift.start_time));
      setShiftEndTime(new Date(shift.end_time));
      setBreakStartTime(new Date(shift.break_start));
      setBreakEndTime(new Date(shift.break_end));
      setLunchStartTime(new Date(shift.lunch_break_start));
      setLunchEndTime(new Date(shift.lunch_break_end));
    }
  }, [companyDetails]);
  

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  });

  // Helper to check if start < end
  const isStartBeforeEnd = (start, end) => start.getTime() < end.getTime();

  // Helper to check if a time is within start and end (inclusive)
  const isWithinRange = (time, rangeStart, rangeEnd) => {
    const t = time.getTime();
    return t >= rangeStart.getTime() && t <= rangeEnd.getTime();
  };

  const onSubmit = () => {
    if (!shiftName.trim()) {
      ToastAndroid.show(t('error_enter_shift_name'), ToastAndroid.SHORT);
      return;
    }

    if (!isStartBeforeEnd(shiftStartTime, shiftEndTime)) {
      ToastAndroid.show(t('error_shift_start_before_end'), ToastAndroid.SHORT);
      return;
    }

    if (!isStartBeforeEnd(breakStartTime, breakEndTime)) {
      ToastAndroid.show(t('error_break_start_before_end'), ToastAndroid.SHORT);
      return;
    }

    if (!isWithinRange(breakStartTime, shiftStartTime, shiftEndTime) || !isWithinRange(breakEndTime, shiftStartTime, shiftEndTime)) {
      ToastAndroid.show(t('error_break_within_shift'), ToastAndroid.SHORT);
      return;
    }

    if (!isStartBeforeEnd(lunchStartTime, lunchEndTime)) {
      ToastAndroid.show(t('error_lunch_start_before_end'), ToastAndroid.SHORT);
      return;
    }

    if (!isWithinRange(lunchStartTime, shiftStartTime, shiftEndTime) || !isWithinRange(lunchEndTime, shiftStartTime, shiftEndTime)) {
      ToastAndroid.show(t('error_lunch_within_shift'), ToastAndroid.SHORT);
      return;
    }

    const formData = {
      shifts: [
        {
          shift_name: shiftName,
          start_time: shiftStartTime,
          end_time: shiftEndTime,
          break_start: breakStartTime,
          break_end: breakEndTime,
          lunch_break_start: lunchStartTime,
          lunch_break_end: lunchEndTime,
          // break_duration_minutes: calculateBreakDuration(breakStartTime, breakEndTime),
        }
      ],
      _id: cId
    };

    setLoading(true);
    dispatch(
      updateContactInfo(formData, (response) => {
        setLoading(false);
        if (response.success) {
          onNext();
          ToastAndroid.show(response.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(response.message, ToastAndroid.SHORT);
        }
      })
    );
    setCurrentStep(currentStep + 1);
  };

  const handleTimeChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      setTimePickerTarget(null);
      return;
    }

    const currentDate = selectedDate || timePickerValue;
    setShowTimePicker(false);

    if (timePickerTarget) {
      timePickerTarget(currentDate);
      setTimePickerTarget(null);
    }
  };

  const showTimePickerFor = (targetSetter, currentValue) => {
    setTimePickerTarget(() => targetSetter);
    setTimePickerValue(currentValue);
    setShowTimePicker(true);
  };

  const TimeRow = ({ label, startTime, setStartTime, endTime, setEndTime }) => (
    <>
      <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
        {t(label)}
      </Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.timePickerButtonRow}
          onPress={() => showTimePickerFor(setStartTime, startTime)}
        >
          <Text style={styles.timeText}>
            {startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.subLabel}>{t('start')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timePickerButtonRow}
          onPress={() => showTimePickerFor(setEndTime, endTime)}
        >
          <Text style={styles.timeText}>
            {endTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.subLabel}>{t('end')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
      <Text style={[Louis_George_Cafe.bold.h2, { color: THEMECOLORS[themeMode].textPrimary, alignSelf: "center", textTransform: "capitalize" }]}>
        {t('timings')}
      </Text>
      <ScrollView contentContainerStyle={styles.form}>
        <Text
          style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
          {t('shift_name')}
        </Text>
        <TextInput
          maxLength={18}
          style={styles.textInput}
          placeholder={t('placeholder_enter_shift_name')}
          value={shiftName}
          onChangeText={setShiftName}
          autoCapitalize="none"
        />

        <TimeRow
          label="shift_time"
          startTime={shiftStartTime}
          setStartTime={setShiftStartTime}
          endTime={shiftEndTime}
          setEndTime={setShiftEndTime}
        />

        <TimeRow
          label="break_time"
          startTime={breakStartTime}
          setStartTime={setBreakStartTime}
          endTime={breakEndTime}
          setEndTime={setBreakEndTime}
        />

        <TimeRow
          label="lunch_time"
          startTime={lunchStartTime}
          setStartTime={setLunchStartTime}
          endTime={lunchEndTime}
          setEndTime={setLunchEndTime}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
          ) : (
            <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText }]}>
              {t('next')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {showTimePicker && (
        <DateTimePicker
          value={timePickerValue}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    paddingHorizontal: wp(4),
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
    lineHeight: wp(6)
  },
  subLabel: {
    fontSize: wp(3),
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: wp(0.5),
    borderColor: '#ccc',
    borderRadius: wp(2),
    padding: wp(3),
    marginVertical: wp(1),
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timePickerButtonRow: {
    flex: 1,
    borderWidth: wp(0.5),
    borderColor: '#ccc',
    borderRadius: wp(2),
    paddingVertical: wp(2),
    marginVertical: wp(1),
    marginHorizontal: wp(1),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: '#000',
  },
  button: {
    marginTop: wp(6),
    padding: wp(3),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
});

export default TimingForm;
