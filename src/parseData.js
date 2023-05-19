const formatVolts = (text) => text.replace(" Volts", "");
const formatWatts = (text) => text.replace(" Watts", "");
const formatPercent = (text) => parseFloat(text.replace(" Percent", "") / 100);
const formatSeconds = (text) => parseFloat(text.replace(" Seconds", ""));
const formatMinutes = (text) => parseFloat(text.replace(" Minutes", ""));
const formatInternalTemperature = (text) =>
  parseFloat(text.replace(" C Internal", ""));
const formatAmbientTemperature = (text) =>
  parseFloat(text.replace(" C Ambient", ""));
const formatHerz = (text) => parseFloat(text.replace(" Hz", ""));
const trim = (text) => text.trim();

module.exports = (data) => {
    const labels = [
      {
        key: "HOSTNAME",
        metric: "hostname",
        description: "The name of the machine that collected the UPS data.",
      },
      {
        key: "UPSNAME",
        metric: "name",
        description:
          "The name of the UPS as stored in the EEPROM or in the UPSNAME directive in the configuration file.",
      },
      {
        key: "MODEL",
        metric: "model",
        description: "The UPS model as derived from information from the UPS.",
      },
      {
        key: "SERIALNO",
        metric: "serial_number",
        description: "The UPS serial number.",
      },
      {
        key: "APCMODEL",
        metric: "apc_model",
        description: "The old APC model identification code.",
      },
    ];
  
    const info = [
      {
        key: "APC",
        metric: "apc_header",
        description:
          "Header record indicating the STATUS format revision level, the number of records that follow the APC statement, and the number of bytes that follow the record.",
      },
      {
        key: "DATE",
        metric: "data_read_date",
        description:
          "The date and time that the information was last obtained from the UPS.",
      },
      {
        key: "HOSTNAME",
        metric: "hostname",
        description: "The name of the machine that collected the UPS data.",
      },
      {
        key: "UPSNAME",
        metric: "name",
        description:
          "The name of the UPS as stored in the EEPROM or in the UPSNAME directive in the configuration file.",
      },
      {
        key: "VERSION",
        metric: "version",
        description: "The apcupsd release number, build date, and platform.",
      },
      {
        key: "CABLE",
        metric: "cable_type",
        description:
          "The cable as specified in the configuration file (UPSCABLE).",
      },
      {
        key: "MODEL",
        metric: "model",
        description: "The UPS model as derived from information from the UPS.",
      },
      {
        key: "UPSMODE",
        metric: "mode",
        description:
          "The mode in which apcupsd is operating as specified in the configuration file (UPSMODE)",
      },
      {
        key: "STARTTIME",
        metric: "start_time",
        description: "The time/date that apcupsd was started.",
      },
      {
        key: "STATUS",
        metric: "status",
        description: "The current status of the UPS (ONLINE, ONBATT, etc.)",
      },
      {
        key: "MBATTCHG",
        metric: "battery_charge_percentage_shutdown_trigger",
        description:
          "If the battery charge percentage (BCHARGE) drops below this value, apcupsd will shutdown your system. Value is set in the configuration file (BATTERYLEVEL)",
      },
      {
        key: "MINTIMEL",
        metric: "minimum_time_left_shutdown_trigger",
        description:
          "apcupsd will shutdown your system if the remaining runtime equals or is below this point. Value is set in the configuration file (MINUTES)",
      },
      {
        key: "MAXTIME",
        metric: "maximum_time_left_shutdown_trigger",
        description:
          "apcupsd will shutdown your system if the time on batteries exceeds this value. A value of zero disables the feature. Value is set in the configuration file (TIMEOUT)",
      },
      {
        key: "MAXLINEV",
        metric: "max_line_voltage",
        description:
          "The maximum line voltage since the UPS was started, as reported by the UPS",
      },
      {
        key: "MINLINEV",
        metric: "min_line_voltage",
        description:
          "The minimum line voltage since the UPS was started, as returned by the UPS",
      },
      {
        key: "SENSE",
        metric: "line_voltage_sensitivity_level",
        description:
          "The sensitivity level of the UPS to line voltage fluctuations.",
      },
      {
        key: "DWAKE",
        metric: "wake_delay",
        description:
          "The amount of time the UPS will wait before restoring power to your equipment after a power off condition when the power is restored.",
      },
      {
        key: "DSHUTD",
        metric: "shutdown_delay",
        description:
          "The grace delay that the UPS gives after receiving a power down command from apcupsd before it powers off your equipment.",
      },
      {
        key: "DLOWBATT",
        metric: "low_battery_signal_delay",
        description:
          "The remaining runtime below which the UPS sends the low battery signal. At this point apcupsd will force an immediate emergency shutdown.",
      },
      {
        key: "LOTRANS",
        metric: "low_line_voltage_battery_trigger",
        description:
          "The line voltage below which the UPS will switch to batteries.",
      },
      {
        key: "HITRANS",
        metric: "high_line_voltage_battery_trigger",
        description:
          "The line voltage above which the UPS will switch to batteries.",
      },
      {
        key: "RETPCT",
        metric: "return_power_on_battery_percentage",
        description:
          "The percentage charge that the batteries must have after a power off condition before the UPS will restore power to your equipment.",
      },
      {
        key: "ALARMDEL",
        metric: "alarm_delay",
        description: "The delay period for the UPS alarm.",
      },
      {
        key: "LASTXFER",
        metric: "last_transfer_reason",
        description: "The reason for the last transfer to batteries.",
      },
      {
        key: "XONBATT",
        metric: "time_on_battery",
        description: "Time and date of last transfer to batteries, or N/A.",
      },
      {
        key: "XOFFBATT",
        metric: "time_off_battery",
        description: "Time and date of last transfer from batteries, or N/A.",
      },
      {
        key: "SELFTEST",
        metric: "self_test_result",
        description:
          "The results of the last self test, and may have the following values:\nOK: self test indicates good battery\nBT: self test failed due to insufficient battery capacity\nNG: self test failed due to overload\nNO: No results (i.e. no self test performed in the last 5 minutes)",
      },
      {
        key: "STESTI",
        metric: "automatic_self_test_interval",
        description: "The interval in hours between automatic self tests.",
      },
      {
        key: "STATFLAG",
        metric: "status_flag",
        description: "Status flag. English version is given by STATUS.",
      },
      {
        key: "DIPSW",
        metric: "dip_switch_settings",
        description: "The current dip switch settings on UPSes that have them.",
      },
      {
        key: "REG1",
        metric: "fault_register_1",
        description: "The value from the UPS fault register 1.",
      },
      {
        key: "REG2",
        metric: "fault_register_2",
        description: "The value from the UPS fault register 2.",
      },
      {
        key: "REG3",
        metric: "fault_register_3",
        description: "The value from the UPS fault register 3.",
      },
      {
        key: "MANDATE",
        metric: "date_of_manufacture",
        description: "The date the UPS was manufactured.",
      },
      {
        key: "SERIALNO",
        metric: "serial_number",
        description: "The UPS serial number.",
      },
      {
        key: "BATTDATE",
        metric: "last_battery_replacement_date",
        description: "The date that batteries were last replaced.",
      },
      {
        key: "NOMOUTV",
        metric: "nominal_output_voltage",
        description:
          "The output voltage that the UPS will attempt to supply when on battery power.",
      },
      {
        key: "NOMINV",
        metric: "nominal_input_voltage",
        description: "The input voltage that the UPS is configured to expect.",
      },
      {
        key: "NOMBATTV",
        metric: "nominal_battery_voltage",
        description: "The nominal battery voltage.",
      },
      {
        key: "NOMPOWER",
        metric: "nominal_power",
        description:
          "The maximum power in Watts that the UPS is designed to supply.",
      },
      {
        key: "EXTBATTS",
        metric: "number_of_user_defined_external_battery_packs",
        description:
          "The number of external batteries as defined by the user. A correct number here helps the UPS compute the remaining runtime more accurately.",
      },
      {
        key: "FIRMWARE",
        metric: "firmware_revision",
        description: "The firmware revision number as reported by the UPS.",
      },
      {
        key: "APCMODEL",
        metric: "apc_model",
        description: "The old APC model identification code.",
      },
      {
        key: "END APC",
        metric: "status_record_write_date",
        description: "The time and date that the STATUS record was written.",
      },
    ];
  
    const metrics = [
      {
        key: "LINEV",
        metric: "line_voltage",
        type: "gauge",
        formatter: formatVolts,
        description: "The current line voltage as returned by the UPS.",
      },
      {
        key: "LOADPCT",
        metric: "load_percentage",
        type: "gauge",
        formatter: formatPercent,
        description: "The percentage of load capacity as estimated by the UPS.",
      },
      {
        key: "BCHARGE",
        metric: "battery_charge_percentage",
        type: "gauge",
        formatter: formatPercent,
        description: "The percentage charge on the batteries.",
      },
      {
        key: "TIMELEFT",
        metric: "time_left",
        type: "gauge",
        formatter: formatMinutes,
        description:
          "The remaining runtime left on batteries as estimated by the UPS.",
      },
      {
        key: "OUTPUTV",
        metric: "output_voltage",
        type: "gauge",
        formatter: formatVolts,
        description: "The voltage the UPS is supplying to your equipment",
      },
      {
        key: "ITEMP",
        metric: "internal_temperature",
        type: "gauge",
        formatter: formatInternalTemperature,
        description: "Internal UPS temperature as supplied by the UPS.",
      },
      {
        key: "BATTV",
        metric: "battery_voltage",
        type: "gauge",
        formatter: formatVolts,
        description: "Battery voltage as supplied by the UPS.",
      },
      {
        key: "LINEFREQ",
        metric: "line_frequency",
        type: "gauge",
        formatter: formatHerz,
        description: "Line frequency in hertz as given by the UPS.",
      },
      {
        key: "NUMXFERS",
        metric: "number_of_transfers_to_battery",
        type: "counter",
        description:
          "The number of transfers to batteries since apcupsd startup.",
      },
      {
        key: "TONBATT",
        metric: "time_on_battery",
        type: "counter",
        formatter: formatSeconds,
        description: "Time in seconds currently on batteries, or 0.",
      },
      {
        key: "CUMONBATT",
        metric: "total_time_on_battery",
        type: "counter",
        formatter: formatSeconds,
        description:
          "Total (cumulative) time on batteries in seconds since apcupsd startup.",
      },
      {
        key: "HUMIDITY",
        metric: "humidity",
        type: "gauge",
        formatter: formatPercent,
        description: "The humidity as measured by the UPS.",
      },
      {
        key: "AMBTEMP",
        metric: "ambient_temperature",
        type: "gauge",
        formatter: formatAmbientTemperature,
        description: "The ambient temperature as measured by the UPS.",
      },
      {
        key: "BADBATTS",
        metric: "number_of_bad_battery_packs",
        type: "counter",
        description: "The number of bad battery packs.",
      },
      {
        key: "NOMPOWER",
        metric: "nominal_power",
        type: "gauge",
        formatter: formatWatts,
        description:
          "The maximum power in Watts that the UPS is designed to supply.",
      },
    ];
  
    const labelsOutput = labels
      .filter((item) => data[item.key] !== undefined)
      .map((item) => `${item.metric}="${trim(data[item.key])}"`)
      .join(", ");
  
    const infoOutput = `# HELP apcupsd_info Information about UPS\n# TYPE apcupsd_info\napcupsd_info{${info
      .filter((item) => data[item.key] !== undefined)
      .map((item) => `${item.metric}="${trim(data[item.key])}"`)
      .join(", ")}} 1.0\n`;
  
    const metricOutput = metrics
      .filter((item) => data[item.key] !== undefined)
      .map((item) => {
        return `# HELP apcupsd_${item.metric} ${
          item.description
        }\n# TYPE apcupsd_${item.metric} ${item.type}\napcupsd_${
          item.metric
        }{${labelsOutput}} ${
          item.formatter ? item.formatter(data[item.key]) : data[item.key]
        }
    `;
      })
      .join("\n");
  
    return `${infoOutput}\n${metricOutput}`;
  };