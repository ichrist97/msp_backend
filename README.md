# MSP Backend

This repository contains the backend for the practical 'Mobile und Verteilte Systeme' for the summer term 2021. The android app consuming this API can be found at this [location](https://gitlab.lrz.de/mobile-ifi/msp/21ss/gruppe1).

## Setup

At first you need to configure a `config.env` file. A starting template can be found the config directory (`config.template.env`). Duplicate, rename and fill this fill with your wanted values.

For mapquest you can generate an api key at [https://developer.mapquest.com/](https://developer.mapquest.com/
).

## Run the api

To run the api:
```
$ npm install
$ npm run start
```

When the api is running, you can inspect its functionalities in the GraphQL playground at `localhost:<PORT>/graphql`

