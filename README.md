# ic_iot_server
With the emmergence of blockchain technology it became possible to create secure unstoppable user controlled software. Blockchain tech allows for a secure immutable backend which would be very inviting for IoT devs but this has not been the case since blockchains are plauged by slow write speeds. The ICP however allows for daaps to be run at internet speed allowing applications which were previosly hindered by the slow speed of other blockchains.

In this repo my collaboreatoors and I will look into the posibility of a blockchain enabled IoT server running fully on chain on ICP.

### Flow
Scenario: Registering a New Device and Viewing Data

  - Accessing the Platform:
       - User navigates to the platform’s Landing Page.

   - Connecting Wallet:
     - User clicks Connect Wallet.
     - Plug wallet prompts for authorization.
     - User approves, and the system retrieves their Principal ID.

  - Dashboard Overview:
        - User is greeted with a summary of their current IoT setup.
        - Clicks on Create a Thing to register a new device.

   - Registering the Device:
       - Fills out the Device Registration Form (e.g., Device Name: "Thermostat").
       - The user is then given a nounce( number used ounce) to register the device with a hardcoded nonce(the code is going to exist only on the device and the canister).
       - This nounce is used to sign device messages to ensure more security
        

  - Device Added:
       - Device appears in the Device List with status indicators.
       - User selects the device to view details.

   - Viewing Data:
     -  Real-Time Data: Sees live temperature readings from the thermostat.
     - Historical Data: Switches to the JSON Viewer to inspect past data logs.
     -  Dashboard (Plots): Views temperature trends over time through interactive graphs.
     - Export functionality to csv

  - Managing Device:
       - Accesses Settings to rename the device or view its nounce.
       - Configures notification preferences for temperature alerts.

  - Receiving Alerts:
       - Receives a notification if the thermostat ever goes offline.
       - Views and acknowledges the alert in the Notification Center.

