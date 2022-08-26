# Twinaide

Twinaide is an open source platform for managing and creating interoperable digital twins. The twinaide project consists of 3 separate projects: a single page application developed with React, a rest api developed with nodejs and expressjs, and a flask api developed to interact with third party services.

Source codes of api developed using nodejs, expressjs and mongodb can be accessed at [twinaide](https://github.com/suatbayir1/twinaide)

The source code of the interface developed using reactjs and various javascript libraries can be accessed at [twinaide-ui](https://github.com/suatbayir1/twinaide-ui)

API developed using python and flask technologies and communicating with third party services can be accessed at [twinaide-python](https://github.com/suatbayir1/twinaide-python)

# Getting Started with Twinaide-ui

Twinaide-ui project is a react-based interface developed to manage and create interoperable digital twins.

### Instal Dependencies

To download the libraries used in the twinaide-ui project, the `npm install` command should be run.

### Set config file
Before starting the ui, a file named `.env` should be created under the root directory and the variable information that appears should be set.

```
REACT_APP_TEST=hello

REACT_APP_API_URL = http://localhost:5000/api/
REACT_APP_PYTHON_URL = http://localhost:5001/api
REACT_APP_DT_VISUAL_FILES_URL = http://localhost:5000/uploads

REACT_APP_TWINBASE_URL = https://dtw.machinaide.twinbase.org/index.json
REACT_APP_KMACK_URL = http://132.226.21.114:8011/api
```

### Start UI

To start the ui, `npm run start` command must be run in the root directory. After running the command the following output should be obtained.

```
Compiled successfully!

You can now view twinaide-ui in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.104:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```