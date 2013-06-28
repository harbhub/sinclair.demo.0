var typescript = require('typescript.api');
var fs         = require('fs');

var input_file  = __dirname + "/src/index.ts";
var output_file = __dirname + "/static/scripts/demo/demo.js";

function errors(units) {

    for (var n in units) {

        for (var d in units[n].diagnostics) {

            console.log(units[n].diagnostics[d].toString());

        }
    }
}

function save(output_file, units) {

    var stream = fs.createWriteStream(output_file);
    
    for (var n in units) {

        stream.write(units[n].content);   
    }

    stream.end();
}

// do compilation.

typescript.resolve([input_file], function(resolved) {
   
    if (!typescript.check(resolved)) { errors(resolved); return; };

    console.log('compiling....');

    var now = new Date();

    typescript.compile(resolved, function(compiled) {

        console.log('completed in ' + ((new Date().getTime() - now.getTime()) / 1000).toString() + ' seconds.' );
        
        if (!typescript.check(compiled)) {errors(compiled); return;  }

        save(output_file, compiled);

        console.log('done.')
        
    });
});
