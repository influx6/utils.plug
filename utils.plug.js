module.exports = (function(){

  var _ = require('stackq');
  var plug = require('plugd');

  var utils = plug.Rack.make('rackStore');

  utils.registerPlug('json.stringify',function(){

    this.newTask('conf',this.makeName('conf')).on(this.$bind(function(p){
      this.config(p.body);
    }));

    this.tasks().on(this.$bind(function(p){
      var res,data = [],b = p.body, stream = p.stream(), indent = this.getConfigAttr('indent') || b.indent || 5;
      stream.on(function(f){ data.push(f); });
      stream.afterEvent('dataEnd',function(){
        try{
          res = JSON.stringify(data.join(''),null,indent);
        }catch(e){
          return this.Reply.from(p,e,null,'json.stringify.error');
        }
        var f = this.Reply.from(p,null,null,'json.stringified');
        f.emit(res);
      });
    }));
  });

  utils.registerPlug('json.parse',function(){

    this.newTask('conf',this.makeName('conf')).on(this.$bind(function(p){
      this.config(p.body);
    }));

    this.tasks().on(this.$bind(function(p){
      var res,data = [],b = p.body, stream = p.stream(), indent = this.getConfigAttr('indent') || b.indent || 5;
      stream.on(function(f){ data.push(f); });
      stream.afterEvent('dataEnd',function(){
        try{
          res = JSON.parse(data.join(''),null,indent);
        }catch(e){
          return this.Reply.from(p,e,null,'json.parse.error');
        }
        var f = this.Reply.from(p,null,null,'json.parsed');
        f.emit(res);
      });
    }));
  });

  utils.registerPlug('node.require',function(){
    this.tasks().on(this.$bind(function(p){
    }));
  });

  return utils;

}());
