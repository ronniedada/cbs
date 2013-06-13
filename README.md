cbs
===========

cbs - A viewer for couchbase phone home stats

Prereqs
-----------
* golang runtime
* [go-couchbase](https://github.com/dustin/go-couchbase)
* [mux](http://www.gorillatoolkit.org/pkg/mux)

Build
----------

    $ make

    $ make clean

Test
----------

Unit and benchmark tests:

    $ make test

Run
----------

Simply point to your couchbase stats cluster

    ./cbs -couchbase="http://10.3.3.241:8091/"
