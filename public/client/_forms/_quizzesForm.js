var example = require('./../../../lib/fixture/quiz').quiz;
var _ = require('underscore');

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




var NodeTree = function NodeTree(parent) {
        this.elements = [];
        this.children = [];
        this.parent = {};
        this.template = "";
        this.index = -1;
        this.templateId = "";

        if (parent){
            this.parent = parent;
            parent.add(this);
        }
    }
    , NodeElement = function NodeElement(template) {
        this.template = template;
        this.templateId = "";
        this.index = -1;
        this.parent = {};
    };


NodeTree.prototype.add = function (child) {
    if (child.constructor.name === 'NodeElement') {
        child.index =this.elements.length;
        this.elements.push(child);
        child.parent = this;

    }
    if (child.constructor.name === 'NodeTree') {

        child.index = this.children.length;
        this.children.push(child);
        child.parent = this;

    }

    //@TODO
    //$(this.template).append(child.template);
};


NodeTree.prototype.remove = function (idx, childType) {
    if (childType === "NodeTree") {
        this.children.splice(idx, 1);
        var len = this.children.length;
        for (var i = idx; i < len; i++) {
            this.children[i].index -= 1;
        }
    }
    //@TODO
    //$(this.template).remove(child.template);
};

NodeElement.prototype.setIndex = function (idx) {
    this.index = idx;
};


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


var config = {
        data: {},
        methodType: 'GET',
        wrapper: 'body'
    }, lastClick = {}, nodeTree,
    reformerData = function (data) {


        data['actionName'] = data.quizzes.length > 0 ? "Update" : "Save";

        if (!data.quizzes.length) {
            var demoQuiz = {quiz: example};
            data.quizzes.push(demoQuiz);
            //config.methodType = 'POST';
        } else {
            config.methodType = 'PUT';
        }

        data.quizzes[0].quiz.questions[0].isActive = true;


        return {form: data};
    },

    reTemplate = function (next) {
        var data = config.data;
        var nt = new NodeTree(null);
        nt.template = $('#quizzes-group-0');
        nt.templateId = '#quizzes-group-0';


        _.each(data.quizzes[0].quiz.questions, function (el, idx) {
                var childTree = new NodeTree(nt);

                var cT = $('#group-pane-0-' + idx);
                childTree.template = cT;
                childTree.templateId = '#group-pane-0-' + idx;
                var currentQuiz = data.quizzes[0].quiz.questions[idx];
                _.each(currentQuiz.answers,function (elem, j) {
                        var childElementTemplate = $('#group-pane-sub-' + idx + '-' + j);
                        var childElement = new NodeElement($(childElementTemplate));
                        childElement.templateId = '#group-pane-sub-' + idx + '-' + j;
                        childTree.add(childElement);
                });

        });

        nodeTree = nt;
        next();
    },

    buildReduce = function (data) {
        for (var prop in data) {
            var element = data[prop];
            if (isArray(element)) {
                //buildReduce(element);
            }
        }
    },
    addChildNode = function (target) {
        // case index === 0 : tab panel
        // case index === 1 : groups
        // case index >=1 : group

        // create template with data.property
        // template append

        // combing target with action
        // events bind with button.


        var targetString = target;
        var templateClone,newIndex,parent,indexArray,newId,tempName;
        if (targetString.indexOf('nav') >= 0) {
            // handle tree node now.

            var cloneNode = nodeTree.children[0];
            //console.log(nodeTree.children);
            parent = cloneNode.parent;
            templateClone = getEmptyNodeTemplate($(parent.children[0].templateId).clone());
            //console.log("templateClone",templateClone);
            var templateNavClone = ($('#quizzes-groups-nav li').first().clone());
            newIndex = parent.children[0].templateId;// #sub-0-0-0-...  when nodeTree.templateId ='';
            var childrenIndex = parent.children.length;

            if (newIndex.indexOf('#') >= 0) {
                newIndex = newIndex.slice(newIndex.indexOf('#') + 1);
            }

            indexArray = newIndex.split('-');
            newId = '';
            _.each(indexArray, function(elem,idx){
                newId += indexArray[idx] + "-";
            });

            newId += childrenIndex;


            $(templateClone).attr('id', newId);

            $(templateClone).find('#options-group-pane-sub-0-0-wrapper .group-pane-sub').each(function (idx, ele) {
                var tempId = $(ele).attr('id');
                var idArray = tempId.split('-');
                $(ele).find('button').attr('data-target', '#group-pane-sub-' + childrenIndex + '-' + idx);
                $(ele).attr('id', 'group-pane-sub-' + childrenIndex + '-' + idArray[idArray.length - 1]);

                // var tempName = $(ele).find('input[type="checkbox"]').attr('name');
                tempName = "quizzes[" + childrenIndex + "][answers][" + idx + "][correct]";
                $(ele).find('input[type="checkbox"]').attr('name', tempName);

                // var tempName = $(ele).find('input[type="text"]').attr('name');
                tempName = "quizzes[" + childrenIndex + "][answers][" + idx + "][option]";
                $(ele).find('input[type="text"]').attr('name', tempName);

            });
            //console.log('childrenIndex',childrenIndex);
            $(templateClone).find('.group-pane-sub-add-btn')
                .attr('data-target', '#group-pane-0-' + childrenIndex + '-0');
            $(templateClone).find('.group-pane-remove-btn')
                .attr('data-target','#group-pane-0-'+childrenIndex);




            var newTree = new NodeTree();
            newTree.children = parent.children[0].children.slice(0);
            newTree.elements = parent.children[0].elements.slice(0);

            // walk through the cloned tree
            for (var il = 0; il < newTree.children.length; il++) {
                var child = newTree.children[il];
                var idArray = child.templateId.split('-');
                idArray[idArray.length - 2] = childrenIndex;
                child.templateId = idArray.join('-');
                child.template = $(child.templateId);
                child.parent = newTree;
            }
            _.each(newTree.elements, function (elem, ix) {
                    var element = newTree.elements[ix];
                    var idArray = element.templateId.split('-');
                    idArray[idArray.length - 2] = childrenIndex;
                    element.templateId = idArray.join('-');
                    element.template = $(element.templateId);
                    element.parent = newTree;
            });

            newTree.template = $(templateClone);
            newTree.templateId = '#' + newId;

            // append nav li

            $('#quizzes-groups-nav li').each(function (idx, ele) {
                if ($(ele).hasClass('active')) $(ele).removeClass('active');
            });
            $(templateNavClone).find('a').html(childrenIndex + 1).attr('href', newTree.templateId);
            $(templateNavClone).attr('id','group-nav-'+childrenIndex);


            $('#quizzes-groups-nav').append(templateNavClone);
//            $(templateNavClone).addClass('active');
//

            // append content
//            $('#quizzes-group-0 .tab-pane').each(function (idx, ele) {
//                if ($(ele).hasClass('active')) $(ele).removeClass('active');
//            });
//            console.log(parent.templateId);


            $(parent.templateId).append(newTree.template);
            //$(newTree.template).addClass('active');
            $('#quizzes-groups-nav li:eq('+(childrenIndex)+') a').tab('show');
            parent.add(newTree);

        } else {
            // handle element node now.
            var whichNode = getChildNode(targetString);
            console.log('which', whichNode);
            parent = whichNode.parent;
            templateClone = getEmptyNodeTemplate($(parent.elements[0].templateId).clone());
            newIndex = parent.elements[0].templateId;
            var elementsIndex = parent.elements.length;

            if (newIndex.indexOf('#') >= 0) {
                console.log("newindex", newIndex.indexOf('#'));
                newIndex = newIndex.slice(newIndex.indexOf('#') + 1);

            }

            console.log("newindex", newIndex);
            indexArray = newIndex.split('-');
            newId = '';
            for (var im = 0; im < indexArray.length - 1; im++) {
                newId += indexArray[im] + "-";
            }


            newId += elementsIndex;


            var newElement = new NodeElement();

            // set name and id to input.

            $(templateClone).attr('id', newId).find('button').attr('data-target', '#' + newId);

            // tempName = $(templateClone).find('input[type="checkbox"]').attr('name');
            tempName = "quizzes[" + parent.index + "][answers][" + elementsIndex + "][correct]";
            $(templateClone).find('input[type="checkbox"]').attr('name', tempName);

            // tempName = $(templateClone).find('input[type="text"]').attr('name');
            tempName = "quizzes[" + parent.index + "][answers][" + elementsIndex + "][option]";
            $(templateClone).find('input[type="text"]').attr('name', tempName);

            newElement.template = $(templateClone);

            newElement.templateId = '#' + newId;


            $(parent.templateId + ' .options-group').append(newElement.template);
            parent.add(newElement);

        }


    },
    getEmptyNodeTemplate = function (templateClone) {
        $(templateClone).find('input').val('').attr('value', '');
        $(templateClone).find('textarea').html('');
        $(templateClone).find("[type='checkbox']").prop('checked', false);
        return $(templateClone);
    },
    getChildNode = function (targetString) {

        if (targetString.lastIndexOf('sub') >= 0)
            targetString = targetString.substr(targetString.lastIndexOf('sub-') + 4);

        if (targetString.indexOf('group-pane-0') >= 0)
            targetString = targetString.substr(targetString.indexOf('group-pane-0-') + 13);

        var indexArray = targetString.split('-');

        var stringTarget = "nodeTree";

        for (var j = 0; j < indexArray.length; j++) {
            if (indexArray[j] !== "") {
                if (j % 2) {
                    stringTarget += ".elements[" + indexArray[j] + "]";
                } else {
                    stringTarget += ".children[" + indexArray[j] + "]";

                }
            }
        }

        //console.log(stringTarget);
        return   eval(stringTarget);
    },
    removeChildNode = function (target) {

        // sub-1-2  level 1 second one.

        var targets = $(target);
        //console.log(targets);
        var i = 0;
        _.each(targets, function(elem,i){
            var finalFn = function (treeArray, whichIndex,type) {
                //console.log(whichIndex !== 0);

                if(whichIndex !== 0){
                    if(type === 'NodeTree'){
                        if(whichIndex < treeArray.length-1){
                            $('#quizzes-groups-nav li:eq('+whichIndex+') a').tab('show');

                        }else if(whichIndex-1 > 0){
                            $('#quizzes-groups-nav li:eq('+(whichIndex-1)+') a').tab('show');
                        }else{
                            $('#quizzes-groups-nav li:eq(0) a').tab('show');
                        }
                    }

                    treeArray.splice(whichIndex, 1);
                }



            };
            (function (done) {
                var targetString = $(targets[i]).attr('id');
                //console.log(targetString);
                var whichNode = getChildNode(targetString);
                var whichIndex = whichNode.index;
                var parentTree = whichNode.parent;
                var tempName,idx;

                if (whichIndex !== 0) $('div').remove(whichNode.templateId);

                if(whichNode.constructor.name === 'NodeElement') {
                  _.each(parentTree.elements, function(element,idx){

                            //if(idx === whichIndex) continue;

                            parentTree.elements[idx].index = idx;
                            var newId = idx - 1;
                            var newTemplateId = 'group-pane-sub-' + parentTree.index + '-' + newId;
                            var tempOldIdObject = $(parentTree.elements[idx].templateId);
                            tempOldIdObject.attr('id', newTemplateId);

                            newTemplateId = "#" + newTemplateId;

                            tempOldIdObject.find('button').attr('data-target', newTemplateId);

                            // var tempName = tempOldIdObject.find('input[type="checkbox"]').attr('name');
                            tempName = "quizzes[" + parentTree.index + "][answers][" + newId + "][correct]";
                            tempOldIdObject.find('input[type="checkbox"]').attr('name', tempName);

                            // var tempName = tempOldIdObject.find('input[type="text"]').attr('name');
                            tempName = "quizzes[" + parentTree.index + "][answers][" + newId + "][option]";
                            tempOldIdObject.find('input[type="text"]').attr('name', tempName);


                            parentTree.elements[idx].templateId = newTemplateId;

                            if (idx === parentTree.elements.length - 1) {
                                done(parentTree.elements, whichIndex,'NodeElement');
                            }
                        });
                }else if(whichNode.constructor.name === 'NodeTree'){
                    //console.log('whichIndex:',whichIndex);
                    if(whichIndex !== 0) $('#group-nav-'+whichIndex).remove();

                    _.each(parentTree.children, function(elem, idx){
                        //if(idx === whichIndex) continue;
                        $('#group-nav-'+idx).children('a').html(idx).attr('href','#group-pane-0-'+(idx-1));
                        $('#group-nav-'+idx).attr('id','group-nav-'+(idx-1));
                        $('#group-pane-0-'+idx).attr('id','group-pane-0-'+(idx-1));
                        $('#group-pane-0-'+idx).find('.group-pane-remove-btn')
                            .attr('data-target','#group-pane-0-'+(idx-1));
                        parentTree.children[idx].index = idx-1;
                        parentTree.children[idx].templateId  = '#group-pane-0-'+(idx-1);
                        var childTree = parentTree.children[idx];
                        _.each(childTree.elements, function(elem, cidx){
                            //if(idx === whichIndex) continue;

                            var newId = childTree.elements[cidx].index;
                            var newTemplateId = 'group-pane-sub-' + childTree.index + '-' + newId;
                            var tempOldIdObject = $(childTree.elements[cidx].templateId);
                            tempOldIdObject.attr('id', newTemplateId);

                            newTemplateId = "#" + newTemplateId;

                            tempOldIdObject.find('button').attr('data-target', newTemplateId);

                            // var tempName = tempOldIdObject.find('input[type="checkbox"]').attr('name');
                            tempName = "quizzes[" + childTree.index + "][answers][" + newId + "][correct]";
                            tempOldIdObject.find('input[type="checkbox"]').attr('name', tempName);

                            // var tempName = tempOldIdObject.find('input[type="text"]').attr('name');
                            tempName = "quizzes[" + childTree.index + "][answers][" + newId + "][option]";
                            tempOldIdObject.find('input[type="text"]').attr('name', tempName);

                            childTree.elements[cidx].templateId = newTemplateId;

                        });
                });
                done(parentTree.children, whichIndex,'NodeTree');
              }
            })(finalFn);
            //console.log(nodeTree);
        });
    },
    handleMouseClickFactory = function (e) {
        e.preventDefault();// @TODO use button type instead
        console.log('preventDefault');
        var target = e.currentTarget;
        var ObjectTarget = $(target).attr('data-target');

        switch ($(target).attr('data-action')) {
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
    isArray = function (obj) {
        return Object.prototype.toString.apply(obj) === '[object Array]';
    };


exports.formBuild = function (options) {

    // each property in data
    // add new tab , add form, add submit button ,add elem button
    // each property in element , isArray
    // add panel element (eq. remove cur elem button)
    // each property in elem  isArray
    // add textArea , checkBox , or radiosGroup
    //
    //@TODO use extend fn.
    config.data = options.data;
    config.wrapper = options.wrapper;
    config.formBody = options.formBody;
    var data = config.data,
        questions = data['questions'];
    //console.log("data.quizzes", data.quizzes);
    data = reformerData(data);

    var wrapper = $(config.formBody);

    var template = require('./../templates/quizzesForm.handlebars');

    buildReduce(data);

    var html = template(data);

    wrapper.append(html);


    reTemplate(function () {
        $('body').on('click', config.formBody + " button[type!='submit']", {lastClick: lastClick}, handleMouseClickFactory);

        wrapper.on('submit', function (e) {

            e.preventDefault();
            var form = $(config.formBody);

            var serializedArray;

            var ajaxURL = '';
            if (config.methodType === 'PUT') {
                ajaxURL = $(form).attr('action') + '/' + data.form.quizzes[0].quiz._id;
                console.log(JSON.stringify($(form).serialize()));
                //serializedArray = serializeJSON($(form).serializeArray());

            } else {
                ajaxURL = $(form).attr('action');
                //serializedArray = $(form).serialize();
            }
            serializedArray = $(form).serialize();
            $.ajax({
                type:config.methodType,
                url: ajaxURL,
                data: serializedArray,
                dataType: "json",
                success: function(json){
                    console.log(json);

                    $('#quizMsg ul').append($('<li> article '+json.art_id+' updated!</li>'))
                        .parent().show().fadeIn();

                },
                error:function(err){
                    console.log(err);
                }
            });


        });
    });


};


var serializeJSON = function (dataArray) {
    var serializedArray = {};
    var tempObjectId = "0";
    var temp2ObjectId = "0";
    var hasMatches, hasPropertyMatches;
    var tempObject = {};
    var temp2Object = {index: -1};
    var key, subKey, subId,subsKey;

    $.each(dataArray, function () {
        var matches = this.name.match(/^(.+?)\[(\d+)\]\[(.+)\]+$/i)
            , value = this.value;

        if (matches) {
            hasMatches = true;
            // serializedArray[key][subId]{pos, answers[]}
            subKey = matches[3];
            subId = matches[2];
            key = matches[1];

            if (!( key in  serializedArray)) {
                serializedArray[key] = [];
            }

            //tempObject.index = subId;

            var propertyMatches = subKey.match(/^(.+?)\]\[(\d+)\]\[(.+)+$/i);


            //console.log(propertyMatches);
            //@TODO if more deeper?


            if (propertyMatches) {
                hasPropertyMatches = true;
                subsKey = propertyMatches[1];
                var subsId = propertyMatches[2];
                var subsKeyName = propertyMatches[3];

                if (!( subsKey in  tempObject)) {
                    tempObject[subsKey] = [];
                }

//                if( !(subsId ==== temp2Object.index)){
//                    if(temp2Object.index!==-1) tempObject[subsKey].push(temp2Object);
//                    temp2Object = {};
//                    temp2Object.index = subsId;
//                }

                if (subsId !== temp2ObjectId) {
                    tempObject[subsKey].push(temp2Object);
                    temp2Object = {};
                    temp2ObjectId = subsId;
                }


                temp2Object[subsKeyName] = value;

            } else {
                hasPropertyMatches = false;
                tempObject[subKey] = value;
            }

            // start from subId.
            if (subId !== tempObjectId) {
                console.log(tempObjectId, subId);
                // insert and start to next loop



                serializedArray[key].push(tempObject);
                tempObject = {};
                tempObjectId = subId;
            }


        } else {
            hasMatches = true;

            serializedArray[this.name] = this.value || '';
        }

    });
    if (hasMatches) {
        if(hasPropertyMatches){
            console.log(temp2Object);
            tempObject[subsKey].push(temp2Object);
        }
        serializedArray[key].push(tempObject);
    }
    return serializedArray;
};
