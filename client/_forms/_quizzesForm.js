var example = require('./../../lib/helpers/data-example');


/*
 {
 quiz:{
 _id:
 index:
 isActive: true,
 question: { type : String, default : '', trim : true},
 answers: [{
 _id:
 index:
 option : { type: String, default : '', trim : true},
 correct: { type: Boolean, default : false }
 }],
 correct: { type: String, default : '', trim : true},
 incorrect: { type: Boolean, default : false }
 }
 }


 {
 action: [
 add: {
 which parent
 },
 remove: {
 which node
 }
 ],
 reindex: function
 }
 */

var NodeTree = function NodeTree(parent){
        this.elements = [];
        this.children =[];
        this.parent = parent;
        if(parent) parent.add(this);
        this.template = "";
        this.index = 0;
        this.templateId ="";
    }
    ,NodeElement = function NodeElement(template){
        this.template =template;
        this.templateId ="";
        this.index=0;
        this.parent={};
    };


NodeTree.prototype.setIndex = function(idx){
    this.index = idx;
}
NodeTree.prototype.add = function(child){
    if(child.constructor.name == 'NodeElement'){
        child.setIndex(this.elements.length);
        this.elements.push(child);
        child.parent = this;

    }
    if(child.constructor.name == 'NodeTree'){

        child.setIndex(this.children.length);
        this.children.push(child);
        child.parent = this;

    }

    //@TODO
    //$(this.template).append(child.template);
}


NodeTree.prototype.remove = function(idx, childType){
    if(childType == "NodeTree"){
        this.children.splice(idx,1);
        var len = this.children.length;
        for(var i = idx; i<len; i++){
            this.children[i].index-=1;
        }
    }
    //@TODO
    //$(this.template).remove(child.template);
}

NodeElement.prototype.setIndex = function(idx){
    this.index = idx;
}


//
//var nt = new NodeTree(null);
//var nt2 = new NodeTree(null);
//
//var nnt = new NodeTree(nt);
//nt.add(nnt);
//nt.add(nnt);
//console.log(nt.children.length);
//var ele = new NodeElement('sssss');
//
//nt.add(ele);
//nt.remove(1,nnt.constructor.name);
//console.log(nt.children.length);
//nt.add(new NodeElement('sssss2'));
//console.log('after',ele);
//console.dir(nt.toString());
//console.log("constructor",nt.constructor.name.toString());
//console.log(nt);


var config={
    data: {},
    wrapper:'body'
    },lastClick = {},nodeTree,
    reformerData = function(data){


        data['actionName'] = data.quizzes.length > 0 ? "Update":"Save";

        if(!data.quizzes.length){
            var demoQuiz =  {quiz:example.quiz};
            data.quizzes.push(demoQuiz);
        }

        data.quizzes[0].quiz.questions[0].isActive = true;


        return {form:data};
    },

    reTemplate = function(next){
        var data =config.data;
        var nt = new NodeTree(null);
        for(var idx = 0; idx < data.quizzes[0].quiz.length; idx++){
//            data.quizzes[idx].index = idx;  // handlebar have been added hindex an oindex.
            (function(idx,nodeTree){

                var childTree =new NodeTree(nodeTree);

                var cT = $('#group-pane-0-'+idx);
                childTree.template = cT;
                childTree.templateId ='#group-pane-0-'+idx;
                var currentQuiz= data.quizzes[0].quiz[idx];
                for(var j = 0; j<currentQuiz.answers.length; j++){
                    (function(j){
                        var childElementTemplate = $('#group-pane-sub-'+idx+'-'+j);
                        var childElement = new NodeElement($(childElementTemplate));
                        childElement.templateId='#group-pane-sub-'+idx+'-'+j;
                    childTree.add(childElement);
                    })(j);
                }

            })(idx,nt);

        }
        console.log('reTemplate',nt);
        nodeTree = nt;

        next();
    },

    buildReduce = function (data){
        for(var prop in data){
            var element = data[prop];
            if(isArray(element)){
                //buildReduce(element);

            }
        }
    },
    addChildNode = function(target){
        // case index == 0 : tab panel
        // case index == 1 : groups
        // case index >=1 : group

        // create template with data.property
        // template append

        // combing target with action
        // events bind with button.

        var targetString = target;
        console.log(targetString);
        var whichNode = getChildNode(targetString);
        console.log('which',whichNode);
        var parent = whichNode.parent;
        var templateClone =getEmptyNodeTemplate($(parent.elements[0].templateId).clone());
        var newIndex = parent.elements[0].templateId;
        var elementsIndex= parent.elements.length;

        if(newIndex.indexOf('#')>=0){
            console.log("newindex",newIndex.indexOf('#'));
            newIndex = newIndex.slice(newIndex.indexOf('#')+1);

        }

        console.log("newindex",newIndex);
        var indexArray = newIndex.split('-');
        var newId='';
        for(var i=0;i<indexArray.length-1;i++){
            newId += indexArray[i]+"-";
        }


        newId +=  elementsIndex;


        console.log(newId);
        var newElement = new NodeElement();
        $(templateClone).attr('id',newId).find('button').attr('data-target','#'+newId);
        var tempName = $(templateClone).find('input[type="checkbox"]').attr('name');



        tempName = "quizzes["+parent.index+"]answers["+elementsIndex+"]correct";
        $(templateClone).find('input[type="checkbox"]').attr('name',tempName);

        var tempName = $(templateClone).find('input[type="text"]').attr('name');

        tempName = "quizzes["+parent.index+"]answers["+elementsIndex+"]option";
        $(templateClone).find('input[type="text"]').attr('name',tempName);

        newElement.template =$(templateClone);
        newElement.templateId = '#'+newId;
        console.log(newElement.template);
        $(parent.templateId+' .options-group').append(newElement.template);
        parent.add(newElement);




    },
    getEmptyNodeTemplate = function(templateClone){
        $(templateClone).find('input').val('')
        //$(templateClone).find('textarea').html('');
        $(templateClone).find("[type='checkbox']").prop('checked',false);
        return $(templateClone);
    },
    getChildNode = function(targetString){
        console.log(targetString);
        if(targetString.lastIndexOf('sub')>=0)
            targetString = targetString.substr(targetString.lastIndexOf('sub-')+4);

        if(targetString.indexOf('group-pane-0')>=0)
            targetString = targetString.substr(targetString.indexOf('group-pane-0-')+13);

        console.log(targetString);

        console.log("chagne",targetString);
        var indexArray = targetString.split('-');

        var stringTarget ="nodeTree";
        console.log(indexArray);
        for(var j= 0; j< indexArray.length; j++){
            if(indexArray[j] !==""){
                if(j%2){
                    stringTarget+=".elements["+indexArray[j]+"]";
                }else{
                    stringTarget+=".children["+indexArray[j]+"]";

                }
            }
        }
        console.log(stringTarget);
        return   eval(stringTarget);
    },
    removeChildNode = function(target){

        // sub-1-2  level 1 second one.

        var targets = $(target);
        console.log(targets.length);
        var i = 0;
        for(var i=0; i< targets.length; i++){

            (function(done){
                var targetString = $(targets[i]).attr('id');

                var whichNode = getChildNode(targetString);

                var whichIndex =whichNode.index;
                if(whichIndex == 0) return;
                console.log("remove templateId",whichNode.templateId);


                var parentTree =whichNode.parent;

                $('div').remove(whichNode.templateId);

                for(var idx=whichIndex; idx<parentTree.elements.length;idx++){
                    (function(){
                        //if(idx == whichIndex) continue;
                        console.log('reform index');
                        parentTree.elements[idx].index=idx;
                        var newId =idx-1;
                        var newTemplateId = 'group-pane-sub-'+i+'-'+newId;
                        var tempOldIdObject = $(parentTree.elements[idx].templateId);
                        tempOldIdObject.attr('id',newTemplateId);

                        newTemplateId="#"+newTemplateId;

                        tempOldIdObject.find('button').attr('data-target',newTemplateId);



                        parentTree.elements[idx].templateId = newTemplateId;

                        if(idx == parentTree.elements.length -1){
                            done(parentTree,whichIndex);
                        }
                    })();
                }


            })(function(parentTree,whichIndex){
                parentTree.elements.splice(whichIndex,1);
            });


            console.log(nodeTree);
        }


    },
    handleMouseClickFactory = function(e){
        //e.preventDefault();
        console.log(e);
        var target = e.currentTarget;
        var ObjectTarget = $(target).attr('data-target');

        switch ($(target).attr('data-action')){
            case  'add':
                addChildNode(ObjectTarget);
                break;
            case  'remove':
                removeChildNode(ObjectTarget);
                break;
            default :
                break;
        }



        lastClick = e.target;

    },
    isArray = function(obj){
        return Object.prototype.toString.apply(obj) === '[object Array]';
    };



exports.formBuild =function (options){
    //@TODO use extend fn.
    config.data = options.data;
    config.wrapper = options.wrapper;
    config.formBody = options.formBody;
    var data = config.data,
        questions = data['questions'];
    console.log("data.quizzes",data.quizzes);
    data = reformerData(data);

    var wrapper =$( config.formBody);

    var template = require('./../templates/quizzesForm.handlebars');


    // each property in data
    // add new tab , add form, add submit button ,add elem button
    // each property in element , isArray
    // add panel element (eq. remove cur elem button)
    // each property in elem  isArray
    // add textArea , checkBox , or radiosGroup
    //


    buildReduce(data);

    var html = template(data);
    wrapper.append(html);
    reTemplate(function(){
        $('body').on('click',config.formBody+" button",{lastClick:lastClick},handleMouseClickFactory);


        wrapper.on('submit',function(e){
            e.preventDefault();
            var form = $(config.formBody);
            var dataArray =$(form).serialize();

            //console.log($(form).attr('action'));
            //console.log("dataArray: ",dataArray);
            var serializedArray = dataArray;

//
//            var tempObject ={index:-1};
//            var temp2Object = {index: -1};
//            $.each(dataArray, function(){
//                var matches = this.name.match( /^(.+?)\[(\d+)\]\[(.+)\]+$/i)
//                    , key
//                    , subKey
//                    , subId
//                    , value = this.value
//                    , subValue = {};
//                console.log(matches);
//
//                if( matches){
//                    // serializedArray[key][subId]{pos, answers[]}
//                    subKey = matches[3];
//                    subId = matches[2];
//                    key = matches[1];
//
//
//                    if( !( key in  serializedArray)){
//                        serializedArray[key] =[];
//                    }
//                    if( !(subId === tempObject.index)){
//                        if(tempObject.index!==-1) serializedArray[key].push(tempObject);
//                        tempObject = {};
//                        tempObject.index = subId;
//                    }
//                    var propertyMatches = subKey.match(/^(.+?)\[(\d+)\]\[(.+)\]+$/i);
//
//                    //@TODO if more deeper?
//                    if(propertyMatches){
//                        var subsKey = propertyMatches[1];
//                        var subsId = propertyMatches[2];
//                        var subsKeyName = propertyMatches[3];
//
//                        if( !( subsKey in  tempObject)){
//                            tempObject[subsKey] =[];
//                        }
//
//                        if( !(subsId === temp2Object.index)){
//                            if(temp2Object.index!==-1) tempObject[subsKey].push(temp2Object);
//                            temp2Object = {};
//                            temp2Object.index = subsId;
//                        }
//                        temp2Object[subsKeyName] = value;
//
//                    }else{
//                        tempObject[subKey] = value;
//                    }
//
//
//
//
//                }else{
//                   serializedArray[this.name] = this.value || '';
//                }
//
//            });
//
//            console.dir(serializedArray);

            $.ajax({
                //type:'POST',
                url: $(form).attr('action')+'?'+serializedArray,
                //data: serializedArray,
                //dataType: "json",
                success: function(json){
                    //console.log(json);

                },
                error:function(err){
                    //console.log(err);
                }
            })


        });
        console.log(nodeTree);
    });




};
