Frontend Overview
=================

The frontend is a React application.

Structure
---------

The UI contains main feature areas:

- `protocol`: building and saving protocols
- `progress`: job run progress visualization
- `instrumentControl`: control commands for the instrument

Building the UI
---------------

.. code-block:: bash
    cd frontend
    npm install
    npm run build


The build output is placed in frontend/dist. The backend serves these files
unless the app is launched in --dev mode.

In development:

.. code-block:: bash
    cd frontend
    npm run dev

Frontend communicates with backend via REST and WebRTC.

