gas-haku
========

`Gear acquisition syndrome is real.`

Never had time to finish this one. Maybe I'll continue some day.

Elegant system for notifiying me of interesting stuff when new [Muusikoiden.net](https://www.muusikoiden.net) marketplace posts are made.

Note to future self; localhost POC still needs:

* React frontend
  * Connect to backend
    * Retrieve data
    * Send interests to backend
* Node backend
  * Implement API to connect to frontend
  * Store everything to S3
  * Deploy to Vercel & fetch data on specific interval & maybe everything to a proper DB
