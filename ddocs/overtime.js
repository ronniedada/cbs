// contact_by_date
function(doc, meta) {
  if (doc.type === 'unique' && doc.active_version) {
    emit([doc.os, doc.numNodes], 1);
  }
}

// contact_by_day_hour_size
function (doc, meta) {
	  if (doc.type == 'stats' && doc.timestamp >= '2011-08-20 && doc.active_version ') {
		  a = doc.timestamp.split(/[-\/:TZ. ]/);
	      d = new Date(a[0], a[1], a[2], a[3], a[4], a[5]);
	      emit([d.getDay(), d.getHours(), doc.numNodes], 1);
	  }
}

// contact_by_hour
function (doc, meta) {
	  if (doc.type == 'stats' && doc.timestamp >= '2011-08-20 && doc.active_version ') {
		  a = doc.timestamp.split(/[-\/:TZ. ]/);
	      d = new Date(a[0], a[1], a[2], a[3], a[4], a[5]);
	      emit([d.getHours()], 1);
	   }
}

// os_date_uuid
function (doc, meta) {
	  if (doc.type === 'stats' && doc.uuid && doc.timestamp >= '2011-08-20' && doc.active_version) {
	      os = doc.nodes.os[0];
	      if (os.match(/apple/)) {
	          os = 'mac';
	      } else if (os.match(/linux/))
              os = 'linux';
	      } else if (os.match(/solaris/)) {
              os = 'sol';
	      } else if (os.match(/freebsd/)) {
	          os = 'fbsd';
	      }
	      a = doc.timestamp.split(/[-\/:TZ. ]/);
	      emit([os, a[0], a[1], a[2], doc.uuid], 1);
	   }
}