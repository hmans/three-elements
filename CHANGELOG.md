# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2021-01-13

- **Fixed:** compatibility with frameworks that set `onupdate` & friends directly as properties (eg. Svelte)

## [0.1.2] - 2021-01-13

- **Fixed:** All of the built-in elements now check if they're already defined before attempting to define themselves again. This is useful for development environments with hot reload or HMR, where they would otherwise raise an error about tags already having been defined.

## [0.1.1] - 2021-01-12

- **Changed:** The `<three-game>` element now has width: 100%, height: 100% and display: block applied to it by default. If you just plug it into the `<body>`, it will use the full display area; if it has a parent element, it will automatically expand its size to fill that. You can, however, also directly style the `three-game` element. The web is a beautiful place!

## [0.1.0] - 2021-01-12

- First release. Let's do this!
