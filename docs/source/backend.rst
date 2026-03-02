Backend Overview
================

The backend provides a FastAPI server that serves:

- REST and WebRTC endpoints for UI interaction
- Dynamic routes based on configuration
- Static frontend files when not in dev mode

It expects a JSON config and may run in dev vs. production mode.

Launching the backend
---------------------

1. Build or serve the frontend (see Frontend docs).
2. Start backend with:

.. code-block:: bash

    uv run src/main.py --config path/to/config.json [--dev]

3. In dev mode the app proxies the frontend dev server.
4. In production mode the backend serves the static build files directly. :contentReference[oaicite:1]{index=1}

API Endpoints
-------------

- `POST /offer` – WebRTC offer endpoint.
- `GET /ui_config` – Returns the UI config file.
- Dynamic `GET` and `POST` endpoints from the JSON config.

Refer to the module documentation for details.