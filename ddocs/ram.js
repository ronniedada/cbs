// os_ram_sizes
function (doc, meta) {
  if (doc.type == 'unique' && doc.ram && doc.ram.total && doc.active_version) {
      var l = Math.log(doc.ram.total);
      emit([doc.os, Math.floor(l / Math.log(1024)),
            Math.floor(l / Math.log(2)),
            doc.ram.total], doc.ram.total);
  }
}