// nodes_counts
function(doc, meta) {
  if (doc.type === 'unique' && doc.browser && doc.active_version) {
    if (doc.browser.match(/Firefox[\/\s](\d+\.\d+)/)) {
        var version=new Number(RegExp.$1);
        emit([doc.numNodes, "Firefox", version], 1);
    }
    else if (doc.browser.match(/MSIE (\d+\.\d+);/)){
        var version=new Number(RegExp.$1);
        emit([doc.numNodes, "IE", version], 1);
    }
    else if (doc.browser.match(/Chrome[\/\s](\d+\.\d+)/)){
        var version=new Number(RegExp.$1);
        emit([doc.numNodes, "Chrome", version], 1);
    }
    else if (doc.browser.match(/Opera[\/\s](\d+\.\d+)/)){
        if (/Version[\/\s](\d+)/.test(doc.browser)) {
           var version=new Number(RegExp.$1);
           emit([doc.numNodes, "Opera", version], 1);
        }
        else {
           emit([doc.numNodes, "Opera", 0], 1);
        }
    }
    else if (doc.browser.match(/Safari[\/\s](\d+\.\d+)/)){
        if (doc.browser.match(/Version[\/\s](\d+\.\d+)/)) {
           var version=new Number(RegExp.$1);
           emit([doc.numNodes, "Safari", version], 1);
        }
        else {
           emit([doc.numNodes, "Safari", 0], 1);
        }
    }
    else if (doc.browser.match(/SeaMonkey[\/\s](\d+\.\d+)/)){
        var version=new Number(RegExp.$1);
        emit([doc.numNodes, "SeaMonkey", version], 1);
    }
    else if (doc.browser.match(/Iceape[\/\s](\d+\.\d+)/)){
        var version=new Number(RegExp.$1);
        emit([doc.numNodes, "Iceape", version], 1);
    }
    else {
        emit([doc.numNodes, "Others", 0], 1);
    }
  }
}