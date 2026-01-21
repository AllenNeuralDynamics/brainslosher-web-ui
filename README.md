# brainslosher web ui

[![License](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)
![Python](https://img.shields.io/badge/python->=3.10-blue?logo=python)

<img src="docs\images\full_page.png" height="400">


React Web app built to control the brainslosher instrument. 

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Python 3.12

### Setup

1. **Install backend dependencies:**
```bash
cd backend
uv sync
```

2.  **Install frontend dependencies:**
```bash
cd frontend
npm install
# or
yarn install
```

### Launch

1. Start brainslosher in separate process. This can be found in [brainwasher/bin/brainslosher_main.py](https://github.com/AllenNeuralDynamics/brainwasher/blob/feat-email-errors/bin/brainslosher_main.py)

```bash
uv run bin/brainslosher_main.py --config path_to_config 
```

2. Launch FastAPI app backend with uvicorn in separate process. Web app will be hosted on 8000 so specify 8000

```bash
uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

3. Start web ui

```bash
cd frontend
npm run dev
```

# Project Structure

## Backend

The backend is expected to be the Brainslosher instrument 

## Backend -> Frontend link

Communication from the backend to frontend is expected to be done through the one-liner package. On the instrument side, this will be facilitated by the server found in [brainwasher/bin/brainslosher_main.py](https://github.com/AllenNeuralDynamics/brainwasher/blob/feat-email-errors/bin/brainslosher_main.py). On the ui side, there is a fastApi layer found in [brainslosher-web-ui/backend/main.py](https://github.com/AllenNeuralDynamics/brainslosher-web-ui/blob/feat-details/backend/main.py). This also sets up a one-liner client and propogates messages to and from the instrument. The communication pattern is outlined below. 

```bash
 __________________________python___________________________                          ____typescript_____
|                                                          |                         |                   |
|brainslosher <---> router_server <---zmq---> router_client| <---http and webrtc---> |brainslosher_web_ui|
|__________________________________________________________|                         |___________________|

```

## Frontend: 

The UI is split into three main components: protocol, progress and instrument control. 

### Protocol:

The protocol section allows you to build/load/save protocols. The current protocol that the ui displays will be run by the instrument.
If the instrument is running or paused, the protocol will be disabled. 

<img src="docs\images\protocol_panel.png" height="400">

### Progress: 

The progress section will update while the machine is running. Progress is expected to be propogated from the instrument. The progress pannel will mirror the steps configured in the protocol panel. It will also inform start, expected end, duration, and remaining times. 

<img src="docs\images\progress_panel.png" height="400">


### Control: 

The control section has functionality to fill, drain, empty waste, start, stop, pause, restart, and clear the instrument.

<img src="docs\images\control_panel_start.png" height="100"> <img src="docs\images\control_panel_running.png" height="100"> <img src="docs\images\control_panel_paused.png" height="100">

**fill**: Clicking the fill button will fill the chamber with the amount of solution specified in the inputs beside the button. 

**drain**: Clicking drain button will pull the maximum chamber volume from the chamber to drain. The chamber may not be totally full, but drain will always drain the maximum chamber volume. 

**empty waste: IMPORTANT**- drain waste button has no physical function. This is just a way to signal the instrument that a user has emptied the waste. 

**start**: pressing the start button will start a run with the current protocol. Only available if instrument is idle and protocol has no resume state. The protocol will be saved to the local computer running the instrument backend at a folder location specified by the instrument config. The name will be the protocol name and timestamp. 

**pause**: pauses instrument. Pause button only visible if instrument running.

**resume**: resume instrument from pause state. Only avaialable if instrument is idle and protocol has a resume state. This will not save a new job file but reuses previously save file.

**restart**: restart paused protocol.  Only avaialable if instrument is idle and protocol has a resume state. This will save a new job file and begin protocol from begining. 

**clear**: clear instrument of current paused state. Only avaialable if instrument is idle and protocol has a resume state.

