Deployment Guide
================

This section documents how to run brainslosher-web-ui in real or production
environments.

Production Deployment
---------------------

1. Build frontend:

   .. code-block:: bash

      cd frontend
      npm run build

2. Start the backend in production mode (no `--dev`).

   .. code-block:: bash

      uv run src/main.py --config path/to/config.json

3. The backend will serve static assets from `frontend/dist`.

Development Deployment
----------------------

In development mode the backend proxies the Vite dev server:

.. code-block:: bash

   # terminal 1
   uv run src/main.py --config config.json --dev

.. code-block:: bash

   # terminal 2
   cd frontend
   npm run dev