# `BlockThings`

With the emmergence of blockchain technology it became possible to create secure unstoppable user controlled software. Blockchain tech allows for a secure immutable backend which would be very inviting for IoT devs but this has not been the case since blockchains are plauged by slow write speeds. The ICP however allows for daaps to be run at internet speed allowing applications which were previosly hindered by the slow speed of other blockchains.

In this repo my collaborators and I will look into the posibility of a blockchain enabled IoT server running fully on chain on ICP.

### Flow
- Scenario: Registering a New Device and Viewing Data

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
        This nounce is used to sign device messages to ensure more security


  - Device Added:
       - Device appears in the Device List with status indicators.
       - User selects the device to view details.

   Viewing Data:
       - Real-Time Data: Sees live temperature readings from the thermostat.
       - Historical Data: Switches to the JSON Viewer to inspect past data logs.
       - Dashboard (Plots): Views temperature trends over time through interactive graphs.
       - Export functionality to csv

  - Managing Device:
       - Accesses Settings to rename the device or view its nounce.
       - Configures notification preferences for temperature alerts.

  - Receiving Alerts:
       - Receives a notification if the thermostat ever goes offline.
       - Views and acknowledges the alert in the Notification Center.


To learn more before you start working with `BlockThings`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd BlockThings/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor
