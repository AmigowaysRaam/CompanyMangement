import React, { useRef, useEffect } from "react";
import { View, Dimensions, Text } from "react-native";
import { WebView } from "react-native-webview";
import { hp, wp } from "../../resources/dimensions";
import { Louis_George_Cafe } from "../../resources/fonts";

const screenWidth = Dimensions.get("window").width;

const initialHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Attendance Chart</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body, html { margin: 0; padding: 0; background-color: #F2E8FF; }
    canvas { width: 100% !important; height: auto !important; }
  </style>
</head>
<body>
  <canvas id="myChart"></canvas>
  <script>
    function createChart(chartData) {
      const ctx = document.getElementById('myChart').getContext('2d');
      if(window.myChartInstance) {
        window.myChartInstance.destroy();
      }
      window.myChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Attendance (%)',
            data: chartData.data,
            fill: true,
            backgroundColor: '#F2E8FF',
            borderColor: '#000',
            tension: 0,
            pointRadius: 10,
            pointHoverRadius: 7,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 50,
              max: 100,
              ticks: {
                stepSize: 10,
                color: '#000000',
                font: {
                  size: 20,
                  weight: 'bold',
                },
                callback: function(value) {
                  return value + '%';
                }
              },
              title: {
                display: true,
                text: 'Attendance (%)',
                color: '#000000',
                font: {
                  size: 20,
                  weight: 'bold',
                }
              }
            },
            x: {
              ticks: {
                color: '#000000',
                font: {
                  size: 25,
                  weight: 'bold',
                },
              },
              title: {
                display: true,
                text: 'Months',
                color: '#000000',
                font: {
                  size: 20,
                  weight: 'bold',
                }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#000000',
                font: {
                  size: 25,
                  weight: 'bold',
                }
              }
            }
          }
        }
      });
    }

    window.addEventListener('message', (event) => {
      const chartData = JSON.parse(event.data);
      createChart(chartData);
    });
  </script>
</body>
</html>
`;

export default function AttendanceChart() {

    const webviewRef = useRef(null);
    const chartData = {
        labels: ["January", "February", "March", "April", "May"],
        data: [60, 75, 80, 65, 90],
    };

    useEffect(() => {
        if (webviewRef.current) {
            const jsToInject = `
        window.postMessage('${JSON.stringify(chartData)}', '*');
        true;
      `;
            // Small delay to ensure WebView is ready
            setTimeout(() => {
                webviewRef.current.injectJavaScript(jsToInject);
            }, 1000);
        }
    }, [chartData]);

    return (
        <View
            style={{
                height: hp(45),
                width: screenWidth - 40,
                margin: wp(2),
                backgroundColor: "#F2E8FF",
                borderRadius: wp(2),
                alignSelf: "center",
                width: wp(95),
            }}
        >
            <Text
                style={[
                    Louis_George_Cafe.bold.h6,
                    {
                        alignSelf: "flex-start",
                        marginHorizontal: wp(4),
                        marginVertical: wp(2),
                    },
                ]}
            >
                Attendance Overview
            </Text>
            <Text
                style={[
                    Louis_George_Cafe.regular.h8,
                    {
                        alignSelf: "flex-start",
                        marginHorizontal: wp(4),
                    },
                ]}
            >
                Last 5 months
            </Text>
            <WebView
                originWhitelist={["*"]}
                source={{ html: initialHtml }}
                style={{
                    flex: 1,
                    margin: wp(2),
                    marginVertical: wp(2),
                }}
                javaScriptEnabled
                domStorageEnabled
                scalesPageToFit
                ref={webviewRef}
            />
        </View>
    );
}
