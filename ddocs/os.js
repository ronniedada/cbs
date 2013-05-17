// os_nodes
function(doc, meta) {
  if (doc.type === 'unique' && doc.active_version) {
    emit([doc.os, doc.numNodes], 1);
  }
}