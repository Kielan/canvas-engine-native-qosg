var ASCII={
TYPE_TEXT:0,TYPE_NEWLINE:1,
TYPE_FG:2,TYPE_MG2:3,TYPE_MG1:4,TYPE_BG:5,
_breakLines:function _breakLines(tokens,maxWidth){
  if(!maxWidth){console.log("err no maxWidth applied")}
  var i=0;var lineLength=0;var lastTokenWithSpace=-1;
  while(i<tokens.length){var token=tokens[i];
    if(token.type==RTK_ASCII.TYPE_NEWLINE){lineLength=0;
      lastTokenWithSpace=-1}
      if(token.type!=RTK_ASCII.TYPE_TEXT)
      {i++;continue}while(lineLength==0&&token.value.charAt(0)==" "){token.value=token.value.substring(1)};
      var index=token.value.indexOf("\n");if(index!=-1){token.value=this._breakInsideToken(tokens,i,index,true);
        var arr=token.value.split("");
        while(arr.length&&arr[arr.length-1]==""){
          arr.pop()}
          token.value=arr.join("")}
          if(!token.value.length){
            tokens.splice(i,1);
            continue
          }
      if(lineLength+token.value.length>maxWidth){
        var index=-1;while(1){
          var nextIndex=token.value.indexOf(" ",index+1);
          if(nextIndex==-1){break}
          if(lineLength+nextIndex>maxWidth){break}
          index=nextIndex}if(index!=-1){
            token.value=this._breakInsideToken(tokens,i,index,true)
          }else if(lastTokenWithSpace!=-1){
            var token=tokens[lastTokenWithSpace];
            var breakIndex=token.value.lastIndexOf("");
            token.value=this._breakInsideToken(tokens,lastTokenWithSpace,breakIndex,true);
            i=lastTokenWithSpace
          }else{
            token.value=this._breakInsideToken(
              tokens,i,maxWidth-lineLength,false)}
            }else{
              lineLength+=token.value.length;
              if(token.value.indexOf(" ")!=-1){
                lastTokenWithSpace=i
              }
            }i++}
            tokens.push({type:RTK_ASCII.TYPE_NEWLINE});
            var lastTextToken=null;
            for(var i=0;i<tokens.length;i++){
              var token=tokens[i];switch(token.type){
                case RTK_ASCII.TYPE_TEXT:lastTextToken=token;
                break;
                case RTK_ASCII.TYPE_NEWLINE: if(lastTextToken){
                  var arr=lastTextToken.value.split("");
                  while(arr.length&&arr[arr.length-1]==" "){arr.pop()}
                  lastTextToken.value=arr.join("")
                }
                  lastTextToken=null;break;
              }
            }
            tokens.pop();
            return tokens
          },
  measure:function measure(str,maxWidth){
    var result={
      width:0,height:1
    };
    var tokens=this.tokenize(str,maxWidth);
    var lineWidth=0;for(var i=0;i<tokens.length;i++){
      var token=tokens[i];
      switch(token.type){
        case this.TYPE_TEXT:lineWidth+=token.value.length;
        break;
        case this.TYPE_NEWLINE:result.height++;result.width=Math.max(result.width,lineWidth);
        lineWidth=0;
        break;
      }
    }
    result.width=Math.max(result.width,lineWidth);
    return result
  },
  tokenize:function tokenize(str,maxWidth){
    var result=[];var offset=0;
    str.replace(this.ASCII_COLORS,function(match,type,name,index){
    var part=str.substring(offset,index);
    if(part.length){
      result.push({type:RTK_ASCII.TYPE_TEXT,value:part})
    };
    result.push({type:type=="c"?RTK_ASCII.TYPE_FG:RTK_ASCII.TYPE_BG,value:name.trim()});
    offset=index+match.length;return""});var part=str.substring(offset);
    if(part.length){result.push({type:RTK_ASCII.TYPE_TEXT,value:part})};
    return this._breakLines(result,maxWidth)
  },
  _breakInsideToken:function _breakInsideToken(tokens,tokenIndex,breakIndex,removeBreakChar){
    var newBreakToken={type:RTK_ASCII.TYPE_NEWLINE};
    var newTextToken={type:RTK_ASCII.TYPE_TEXT,value:tokens[tokenIndex].value.substring(breakIndex+(removeBreakChar?1:0))};
    tokens.splice(tokenIndex+1,0,newBreakToken,newTextToken);
    return tokens[tokenIndex].value.substring(0,breakIndex)
  },
}
export { ASCII }
