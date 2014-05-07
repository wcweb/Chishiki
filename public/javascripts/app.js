(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var example = require('./../../lib/example/quiz').quiz;


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


        for (var idx = 0; idx < data.quizzes[0].quiz.questions.length; idx++) {
//            data.quizzes[idx].index = idx;  // handlebar have been added hindex an oindex.
            (function () {

                var childTree = new NodeTree(nt);

                var cT = $('#group-pane-0-' + idx);
                childTree.template = cT;
                childTree.templateId = '#group-pane-0-' + idx;
                var currentQuiz = data.quizzes[0].quiz.questions[idx];
                for (var j = 0; j < currentQuiz.answers.length; j++) {
                    (function () {
                        var childElementTemplate = $('#group-pane-sub-' + idx + '-' + j);
                        var childElement = new NodeElement($(childElementTemplate));
                        childElement.templateId = '#group-pane-sub-' + idx + '-' + j;
                        childTree.add(childElement);
                    })();
                }

            })();

        }
        // console.log('reTemplate', nt);
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
        console.log(targetString);
        
        var templateClone,newIndex,parent,indexArray,newId,tempName;
        
        
        if (targetString.indexOf('nav') >= 0) {
            // handle tree node now.

            var cloneNode = nodeTree.children[0];
            console.log(nodeTree.children);
            parent = cloneNode.parent;
            templateClone = getEmptyNodeTemplate($(parent.children[0].templateId).clone());
            console.log("templateClone",templateClone);
            var templateNavClone = ($('#quizzes-groups-nav li').first().clone());
            newIndex = parent.children[0].templateId;// #sub-0-0-0-...  when nodeTree.templateId ='';
            var childrenIndex = parent.children.length;

            if (newIndex.indexOf('#') >= 0) {
                newIndex = newIndex.slice(newIndex.indexOf('#') + 1);
            }

            indexArray = newIndex.split('-');
            newId = '';
            for (var i = 0; i < indexArray.length - 1; i++) {
                newId += indexArray[i] + "-";
            }


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
            console.log('childrenIndex',childrenIndex);
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
            for (var ix = 0; ix < newTree.elements.length; ix++) {
                (function () {
                    var element = newTree.elements[ix];
                    var idArray = element.templateId.split('-');
                    idArray[idArray.length - 2] = childrenIndex;
                    element.templateId = idArray.join('-');
                    element.template = $(element.templateId);
                    element.parent = newTree;
                })();

            }


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
        console.log(targets);
        var i = 0;
        for (i = 0; i < targets.length; i++) {
            var finalFn = function (treeArray, whichIndex,type) {
                console.log(whichIndex !== 0);

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
                console.log(targetString);
                var whichNode = getChildNode(targetString);
                var whichIndex = whichNode.index;
                var parentTree = whichNode.parent;
                var tempName,idx;

                if (whichIndex !== 0) $('div').remove(whichNode.templateId);

                if(whichNode.constructor.name === 'NodeElement') {

                    for (idx = whichIndex+1; idx < parentTree.elements.length; idx++) {
                        (function () {
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
                        })();
                    }
                }else if(whichNode.constructor.name === 'NodeTree'){
                    console.log('whichIndex:',whichIndex);
                    if(whichIndex !== 0) $('#group-nav-'+whichIndex).remove();

                    for (idx = whichIndex; idx < parentTree.children.length; idx++) {
                        if(idx === whichIndex){

                            if (idx === parentTree.children.length - 1 || idx === 0) {

                                return done(parentTree.children, whichIndex,'NodeTree');
                            }
                            continue;
                        }
                        (function () {

                            //if(idx === whichIndex) continue;
                            $('#group-nav-'+idx).children('a').html(idx).attr('href','#group-pane-0-'+(idx-1));
                            $('#group-nav-'+idx).attr('id','group-nav-'+(idx-1));
                            $('#group-pane-0-'+idx).attr('id','group-pane-0-'+(idx-1));
                            $('#group-pane-0-'+idx).find('.group-pane-remove-btn')
                                .attr('data-target','#group-pane-0-'+(idx-1));
                            parentTree.children[idx].index = idx-1;
                            parentTree.children[idx].templateId  = '#group-pane-0-'+(idx-1);
                            var childTree = parentTree.children[idx];
                            for (var cidx = 0 ; cidx < childTree.elements.length; cidx++) {
                                (function () {
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


                                })();
                            }
                            if (idx === parentTree.children.length - 1) {
                                done(parentTree.children, whichIndex,'NodeTree');
                            }
                        })();
                    }

                }


            })(finalFn);


            //console.log(nodeTree);
        }


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
    console.log("data.quizzes", data.quizzes);
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
},{"./../../lib/example/quiz":6,"./../templates/quizzesForm.handlebars":5}],2:[function(require,module,exports){
exports.init= function(){
    $('#buildScorm').on('click',function(e){
        e.preventDefault();
        var aid = $(e.currentTarget).attr('data-target');
        var ajaxURL = '/scorm/'+aid+'/build';

        $.ajax({
            url: ajaxURL,
            success: function(json){
                console.log(json);
            },
            error:function(err){
                console.log(err);
            }
        });
    });
    $('#downloadSCORM').on('click',function(e){
        e.preventDefault();
        var aid = $(e.currentTarget).attr('data-target');
        var ajaxURL = '/scorm/'+aid+'/exportSCORM';

        $.ajax({
            url: ajaxURL,
            success: function(json){
                console.log(json);
            },
            error:function(err){
                console.log(err);
            }
        });
    });

};
},{}],3:[function(require,module,exports){
//Module.exports= function(){
//define('_forms/_videosForm', ['exports'], function(__exports___){
exports.videoInit= function(){
    $(document).ready(function () {

        // @TODO  refactor
        /*
         * {
         *   wrapper_name,
         *   group_name,
         *   property_name,
         *   button_id,
         *   button_data-target_index
         *   control_id
         *   form_element_tagName
         *   form_id
         * }
         * */
        $(document).on('click','button.remove-video-btn',{}, removeVideoFn);

        $(document).on('click','button.remove-video-btn',{}, removeVideoFn);

        //$('button.remove-video-btn').on('click',removeVideoFn);
        // jquery 1.7
        //$('.remove-video-btn').live('click', removeVideoFn);



        $('#videoForm #add').on('click', function(e){
            e.preventDefault();
            //@TODO first with append.
            var count = $('.video-group').length;
            var template =$('.video-group').first().clone();
            $(template).children('.crud-video-control').toggleClass('hide').children();
            var elements = $(template).children().children().children("[name^='videos']");
            var button = $(template).children('.crud-video-control').children().children(' button');
            button.attr('id','temp-video-id');
            button.attr('data-target',count);
            elements.each(function(idx, ele){
                var attr_name = $(ele).attr('name');
                var word_star_at = attr_name.indexOf('[');
                var word_end_at = attr_name.indexOf(']');
                var new_attr_name =attr_name.substr(0, word_star_at+1)+count+ attr_name.substr(word_end_at);

                $(ele).attr('name', new_attr_name);

                if($(ele).is('textarea')){
                    $(ele).empty();
                }
                if($(ele).is('input')){
                    $(ele).val('');
                }
            });

            $('#videos-group').append(template);
        });

        $("#videoForm button[type='submit']").on('click',function(e){
            var form = $('#videoForm');
            var data =$(form).serialize();

            $.ajax({
                url: $(form).attr('action'),
                data: data,
                success: function(json){
                    flash('success update video.');

                }
            });
        });
//        $('#videoForm').on('submit', function(e){
//            e.preventDefault();
//        });


    });


    var flash=function(message){
    //    $('.main-content').prepend($('.fade.in.alert-info'))

    //        .fade.in.alert.alert-danger
        //    button.close(type='button', data-dismiss='alert') ×
        //    ul
        //    - each error in errors
        //    li!= error
    };


    var removeVideoFn = function(e){
        e.preventDefault();
        var target = e.target;
        var currentIndex= $(target).attr('data-target');
        console.log($(target).attr('id'));

        if('temp-video-id' === $(target).attr('id')){
            $('.video-group')[currentIndex].remove();
        }else{
            var form = $('#videoForm');
            var videoId = $(target).attr('id');
            $.ajax({
                url: $(form).attr('action')+ "/"+videoId,
                type:'DELETE',
                headers: {
                    'X-CSRF-Token': $('[name="_csrf"]').val()
                },

                success: function(json){
                    $('.video-group')[currentIndex].remove();
                }
            });
        }

        // recount
        $('.video-group').each(function(idx, child){

            var target = $(child).children().children().children("[name^='videos']");
            target.each(function(i,ele){
                var attr_name = $(ele).attr('name');
                var word_star_at = attr_name.indexOf('[');
                var word_end_at = attr_name.indexOf(']');
                var new_attr_name =attr_name.substr(0, word_star_at+1)+idx+ attr_name.substr(word_end_at);

                $(ele).attr('name', new_attr_name);

            });
            var remove_btn = $(child).children('.crud-video-control').children().children(' button');
            remove_btn.attr('data-target',idx);

        });
    };

};
},{}],4:[function(require,module,exports){

$(document).ready(function () {

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });


});
// @TODO will concat file with gulp in the future
//$.getScript(domain.scriptPath+"_forms/_videosForm.js", function(){
//    //require('./_forms/_videosForm');
//});

//require handlebars


require('./../lib/helpers/handlebars-helpers');

require('./_forms/_videosForm.js').videoInit();

//require('./templates/quizzesForm.handlebars');
//MyApp = window['MyApp'] ||{};
//MyApp.templates = window['MyApp'].templates || {};

var MyApp = window['MyApp'] ||{};
MyApp = require('./_forms/_quizzesForm.js');

function flash(msg){

}

if($('#buildScorm').length){
    require('./_forms/_scromForm.js').init();
}

},{"./../lib/helpers/handlebars-helpers":7,"./_forms/_quizzesForm.js":1,"./_forms/_scromForm.js":2,"./_forms/_videosForm.js":3}],5:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n\n    <div class=\"quiz-group\" data-target=\""
    + escapeExpression((helper = helpers.setIndex || (depth0 && depth0.setIndex),options={hash:{},data:data},helper ? helper.call(depth0, (data == null || data === false ? data : data.index), options) : helperMissing.call(depth0, "setIndex", (data == null || data === false ? data : data.index), options)))
    + "\">\n      <div class=\"\">\n          <ul class=\"nav nav-pills group-nav\" id=\"quizzes-groups-nav\">\n            ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.quiz)),stack1 == null || stack1 === false ? stack1 : stack1.questions), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n              <span class=\" pull-right\">\n                  <button id=\"add\" data-target=\"#quizzes-groups-nav\" data-action=\"add\"\n                          class=\"btn btn-primary group-pane-add-btn\">Add Question</button>\n              </span>\n          </ul>\n          \n          \n          \n      </div>\n      <div class=\"tab-content group-wrapper\" id=\"quizzes-group-0\">\n        ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.quiz)),stack1 == null || stack1 === false ? stack1 : stack1.questions), {hash:{},inverse:self.noop,fn:self.programWithDepth(5, program5, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n      </div>\n\n    </div>\n  ";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                <li  class=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isActive), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" id=\"group-nav-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                    <a data-toggle=\"tab\" href=\"#group-pane-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" title=\"";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">"
    + escapeExpression((helper = helpers.setIndex || (depth0 && depth0.setIndex),options={hash:{},data:data},helper ? helper.call(depth0, (data == null || data === false ? data : data.index), options) : helperMissing.call(depth0, "setIndex", (data == null || data === false ? data : data.index), options)))
    + "</a>\n                </li>\n            ";
  return buffer;
  }
function program3(depth0,data) {
  
  
  return "active";
  }

function program5(depth0,data,depth1) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div class=\"tab-pane ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isActive), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " group-pane\" id=\"group-pane-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                <div class=\"\">\n                    <div class=\"form-group\">\n                        <label for=\"title\" class=\"col-sm-2 control-label\">Question:</label>\n\n                        <div class=\"col-sm-1 col-sm-offset-9\">\n                            <button type=\"button\" data-target=\"#group-pane-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-action=\"remove\"\n                                    class=\"close group-pane-remove-btn\" title=\" 1st would not be deleted!\">×</button>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <div class=\"col-sm-11 col-sm-offset-1\">\n\n                            <textarea rows=\"3\" name=\"quizzes["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][question]\"\n                                      placeholder=\"Enter the Question title\" class=\"form-control\">";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                            </textarea>\n                        </div>\n                    </div>\n                    <div class=\"options-group col-sm-offset-1\" id=\"options-group-pane-sub-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-wrapper\">\n\n                       ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.answers), {hash:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n                    </div>\n                    <div class=\"form-group crud-option-control\">\n                        <div class=\"col-sm-10 col-sm-offset-2\">\n                            <button data-target=\"#group-pane-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-0\"  data-action=\"add\"\n                                    class=\"btn btn-info pull-right group-pane-sub-add-btn\">\n                                add an option\n                            </button>\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"correct\" class=\"col-sm-3 control-label\">Correct</label>\n\n                        <div class=\"col-sm-9\">\n                            <textarea rows=\"2\" name=\"quizzes["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][correct]\"\n                                      placeholder=\"If Correct : \" class=\"form-control\">";
  if (helper = helpers.correct) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.correct); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                            </textarea>\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"incorrect\" class=\"col-sm-3 control-label\">Incorrect</label>\n\n                        <div class=\"col-sm-9\">\n                            <textarea rows=\"2\" name=\"quizzes["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][incorrect]\"\n                                      placeholder=\"If incorrect : \" class=\"form-control\">";
  if (helper = helpers.incorrect) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.incorrect); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                            </textarea>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ";
  return buffer;
  }
function program6(depth0,data,depth1) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                          <div class=\"option-group group-pane-sub\" id=\"group-pane-sub-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                              <div class=\"form-group\">\n                                  <label for=\"option\" class=\"col-sm-2 control-label\">Option :</label>\n\n                                  <div class=\"col-sm-9\">\n                                      <input type=\"text\" name=\"quizzes["
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][answers]["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][option]\"\n                                             value=\"";
  if (helper = helpers.option) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.option); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"\n                                             placeholder=\"Enter option title\" class=\"form-control\">\n                                  </div>\n                                  <div class=\"col-sm-1\">\n                                      <button type=\"button\" data-target=\"#group-pane-sub-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\n                                              data-action=\"remove\" class=\"close group-pane-sub-remove-btn\">×</button>\n                                  </div>\n                              </div>\n                              <div class=\"form-group\">\n                                  <div class=\"col-sm-9 col-sm-offset-2\">\n                                      <input type=\"checkbox\" name=\"quizzes["
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][answers]["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][correct]\"\n                                             placeholder=\"Correct ? \"\n                                        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.correct), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " >\n                                      <label for=\"correctBool\" class=\"control-label\">Correct ?</label>\n                                  </div>\n                              </div>\n                          </div>\n                       ";
  return buffer;
  }
function program7(depth0,data) {
  
  
  return " checked ";
  }

  buffer += "<div id=\"quizzes-groups\">\n    <div class=\" alert alert-info\" id=\"quizMsg\" style=\"display:none;\">\n        <button type=\"button\" data-dismiss=\"alert\" class=\"close\">×</button>\n        <ul>\n            <li>Quiz Added!</li>\n        </ul>\n    </div>\n  ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.form)),stack1 == null || stack1 === false ? stack1 : stack1.quizzes), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n<div class=\"form-group crud-quiz-control\">\n\n    <div class=\"col-sm-10\">\n        <hr/>\n\n        <button type=\"submit\" class=\"btn btn-primary\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.form)),stack1 == null || stack1 === false ? stack1 : stack1.actionName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</button>\n        &nbsp;<a href=\"/articles\" title=\"cancel\" class=\"btn\">Cancel</a>\n\n    </div>\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":15}],6:[function(require,module,exports){

var quizExample = exports.quiz = {
    "info": {
        "name":    "小测试!!",
        "main":    "<p>看完视频 小测一下!</p>",
        "results": "<h5>测试完成</h5><p></p>",
        "level1":  "完全掌握理解运用。",
        "level2":  "掌握得不错",
        "level3":  "恭喜您，合格了。",
        "level4":  "麻麻啦，基本拉车尾。",
        "level5":  "仍然需要努力哦..." // no comma here
    },
    "questions": [
        { // Question 1 - Multiple Choice, Single True Answer
            "question": "男性330303030,50岁,农民,以衰弱、气促、轻度干咳8个月入院。体检:呼吸28次/分,两肺底闻爆裂音(Velcro罗音),有杵状指,胸部X线:两肺中下野弥漫性网状影,肺功能示限制性通气障碍,最可能的诊断是",
            "answers": [
                {"option": "A.慢性支气管炎",      "correct": false},
                {"option": "B.特发性肺间质纤维化",     "correct": true},
                {"option": "C.支气管扩张症",      "correct": false},
                {"option": "D.心力衰竭",     "correct": false},
                {"option": "E.矽肺",     "correct": false} // no comma here
            ],
            "correct": "<p> 答案：B <span>您答对了！</span> 要记住肺纤维化：肺功能提示的是限制性通气障碍。查体通常有杵状指。</p>",
            "incorrect": "<p>答案：B <span>抱歉，答错了。</span> 见到两肺底闻爆裂音(Velcro罗音)或见到胸部X线:两肺中下野弥漫性网状影就是肺纤维化；</p>" // no comma here
        },
        { // Question 2 - Multiple Choice, Multiple True Answers, Select Any
            "question": "支气管哮喘患者急性发作5天,测动脉血气pH7.40、PaO6.67kPa(50mmHg),PaCO8.0kPa(60mmHg)、HCO30mmol/L，最可能表明",
            "answers": [
                {"option": "A.病情好转",               "correct": false},
                {"option": "B.没有临床意义",   "correct": true},
                {"option": "C.轻度发作",               "correct": false},
                {"option": "D.病情严重,须积极治疗",               "correct": true},
                {"option": "E.有心血管并发症", "correct": false} // no comma here
            ],
            "select_any": true,
            "correct": "<p>答案：D <span>您答对了！!</span> <span>分析：</span><br /> \
                        支气管哮喘发作时是呼气性呼吸困难，血气分析常常是：呼吸性碱中毒。 \
                        题干出现哮喘发作5天，提示是重症哮喘。（哮喘持续状态可持续1-2天，又称为重症哮喘；每分钟呼吸28次/分，P大于110次/分。可出现呼吸机疲劳，出现奇脉，血压下降、大汗淋漓、严重脱水、神志模糊。出现呼吸性酸中毒，若缺氧明显可合并代谢性酸中毒）\
                        题干提示：出现PaCO潴留，说明是重症哮喘。\
                        综上所述是D</p>",
            "incorrect": "<p>答案：B D <span>抱歉，答错了。.</span> <br /> \
                        <span>分析：</span><br /> \
                        支气管哮喘发作时是呼气性呼吸困难，血气分析常常是：呼吸性碱中毒。 \
                        题干出现哮喘发作5天，提示是重症哮喘。（哮喘持续状态可持续1-2天，又称为重症哮喘；每分钟呼吸28次/分，P大于110次/分。可出现呼吸机疲劳，出现奇脉，血压下降、大汗淋漓、严重脱水、神志模糊。出现呼吸性酸中毒，若缺氧明显可合并代谢性酸中毒）\
                        题干提示：出现PaCO潴留，说明是重症哮喘。\
                        综上所述是B D </p>" // no comma here
        },
        { // Question 3 - Multiple Choice, Multiple True Answers, Select All
            "question": "支气管哮喘发病的最主要病理基础是.",
            "answers": [
                {"option": "气道的非特异性炎症",           "correct": true},
                {"option": "副交感神经兴奋",                  "correct": false},
                {"option": "细菌感染",  "correct": false},
                {"option": "支气管痉挛",          "correct": false} // no comma here
            ],
            "correct": "<p> 答案：A <span>您答对了！!</span> 支气管哮喘的定义已涵盖了，死记。</p>",
            "incorrect": "<p>答案：A <span>抱歉，答错了。.</span> 支气管哮喘的定义已涵盖了，死记。</p>" // no comma here
        },
        { // Question 4
            "question": "男性60岁，突然夜间发作呼吸困难，查体：双肺满布呼气性哮鸣音。下面哪几项对鉴别诊断有意义。",
            "answers": [
                {"option": "A.血气分析",    "correct": false},
                {"option": "B.超声心动图",     "correct": true},
                {"option": "C.胸部X线",      "correct": true},
                {"option": "E.既往病史",   "correct": true} // no comma here
            ],
            "correct": "<p>答案：A<span>您答对了！!</span> </p>",
            "incorrect": "<p>答案：A<span>抱歉，答错了。.</span> </p>" // no comma here
        }
    ]
};

},{}],7:[function(require,module,exports){

var Handlebars = require('hbsfy/runtime');
Handlebars.registerHelper('setIndex', function(value){
    this.oindex = value;     // @TODO some time ../index can't work?
    this.hindex = Number(value + 1); //I needed human readable index, not zero based
    return this.hindex;
});

Handlebars.registerHelper('lookup', function(obj, field){
    return obj[field];
})
},{"hbsfy/runtime":15}],8:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":9,"./handlebars/exception":10,"./handlebars/runtime":11,"./handlebars/safe-string":12,"./handlebars/utils":13}],9:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":10,"./utils":13}],10:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],11:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":9,"./exception":10,"./utils":13}],12:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],13:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":12}],14:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":8}],15:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":14}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL2NsaWVudC9fZm9ybXMvX3F1aXp6ZXNGb3JtLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL2NsaWVudC9fZm9ybXMvX3Njcm9tRm9ybS5qcyIsIi9Vc2Vycy93Y3dlYi9Eb2N1bWVudHMvZGV2ZWxvcGVyL25vZGVqcy9DaGlzaGlraS9jbGllbnQvX2Zvcm1zL192aWRlb3NGb3JtLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL2NsaWVudC9hcHAuanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvY2xpZW50L3RlbXBsYXRlcy9xdWl6emVzRm9ybS5oYW5kbGViYXJzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL2xpYi9leGFtcGxlL3F1aXouanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbGliL2hlbHBlcnMvaGFuZGxlYmFycy1oZWxwZXJzLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIi9Vc2Vycy93Y3dlYi9Eb2N1bWVudHMvZGV2ZWxvcGVyL25vZGVqcy9DaGlzaGlraS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9leGNlcHRpb24uanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy91dGlscy5qcyIsIi9Vc2Vycy93Y3dlYi9Eb2N1bWVudHMvZGV2ZWxvcGVyL25vZGVqcy9DaGlzaGlraS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL25vZGVfbW9kdWxlcy9oYnNmeS9ydW50aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2x0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBleGFtcGxlID0gcmVxdWlyZSgnLi8uLi8uLi9saWIvZXhhbXBsZS9xdWl6JykucXVpejtcblxuXG4vKlxuIHtcbiBxdWl6OntcbiBfaWQ6XG4gaW5kZXg6XG4gaXNBY3RpdmU6IHRydWUsXG4gcXVlc3Rpb246IHsgdHlwZSA6IFN0cmluZywgZGVmYXVsdCA6ICcnLCB0cmltIDogdHJ1ZX0sXG4gYW5zd2VyczogW3tcbiBfaWQ6XG4gaW5kZXg6XG4gb3B0aW9uIDogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQgOiAnJywgdHJpbSA6IHRydWV9LFxuIGNvcnJlY3Q6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdCA6IGZhbHNlIH1cbiB9XSxcbiBjb3JyZWN0OiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdCA6ICcnLCB0cmltIDogdHJ1ZX0sXG4gaW5jb3JyZWN0OiB7IHR5cGU6IEJvb2xlYW4sIGRlZmF1bHQgOiBmYWxzZSB9XG4gfVxuIH1cblxuXG4ge1xuIGFjdGlvbjogW1xuIGFkZDoge1xuIHdoaWNoIHBhcmVudFxuIH0sXG4gcmVtb3ZlOiB7XG4gd2hpY2ggbm9kZVxuIH1cbiBdLFxuIHJlaW5kZXg6IGZ1bmN0aW9uXG4gfVxuICovXG5cbnZhciBOb2RlVHJlZSA9IGZ1bmN0aW9uIE5vZGVUcmVlKHBhcmVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSB7fTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUlkID0gXCJcIjtcblxuICAgICAgICBpZiAocGFyZW50KXtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgcGFyZW50LmFkZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAsIE5vZGVFbGVtZW50ID0gZnVuY3Rpb24gTm9kZUVsZW1lbnQodGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICB0aGlzLnRlbXBsYXRlSWQgPSBcIlwiO1xuICAgICAgICB0aGlzLmluZGV4ID0gLTE7XG4gICAgICAgIHRoaXMucGFyZW50ID0ge307XG4gICAgfTtcblxuXG5Ob2RlVHJlZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgaWYgKGNoaWxkLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdOb2RlRWxlbWVudCcpIHtcbiAgICAgICAgY2hpbGQuaW5kZXggPXRoaXMuZWxlbWVudHMubGVuZ3RoO1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnB1c2goY2hpbGQpO1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuXG4gICAgfVxuICAgIGlmIChjaGlsZC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnTm9kZVRyZWUnKSB7XG5cbiAgICAgICAgY2hpbGQuaW5kZXggPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcblxuICAgIH1cblxuICAgIC8vQFRPRE9cbiAgICAvLyQodGhpcy50ZW1wbGF0ZSkuYXBwZW5kKGNoaWxkLnRlbXBsYXRlKTtcbiAgICBcbiAgICBcbn07XG5cblxuTm9kZVRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpZHgsIGNoaWxkVHlwZSkge1xuICAgIGlmIChjaGlsZFR5cGUgPT09IFwiTm9kZVRyZWVcIikge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB2YXIgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSBpZHg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5pbmRleCAtPSAxO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vQFRPRE9cbiAgICAvLyQodGhpcy50ZW1wbGF0ZSkucmVtb3ZlKGNoaWxkLnRlbXBsYXRlKTtcbn07XG5cbk5vZGVFbGVtZW50LnByb3RvdHlwZS5zZXRJbmRleCA9IGZ1bmN0aW9uIChpZHgpIHtcbiAgICB0aGlzLmluZGV4ID0gaWR4O1xufTtcblxuXG4vL1xuLy92YXIgbnQgPSBuZXcgTm9kZVRyZWUobnVsbCk7XG4vL3ZhciBudDIgPSBuZXcgTm9kZVRyZWUobnVsbCk7XG4vL1xuLy92YXIgbm50ID0gbmV3IE5vZGVUcmVlKG50KTtcbi8vbnQuYWRkKG5udCk7XG4vL250LmFkZChubnQpO1xuLy9jb25zb2xlLmxvZyhudC5jaGlsZHJlbi5sZW5ndGgpO1xuLy92YXIgZWxlID0gbmV3IE5vZGVFbGVtZW50KCdzc3NzcycpO1xuLy9cbi8vbnQuYWRkKGVsZSk7XG4vL250LnJlbW92ZSgxLG5udC5jb25zdHJ1Y3Rvci5uYW1lKTtcbi8vY29uc29sZS5sb2cobnQuY2hpbGRyZW4ubGVuZ3RoKTtcbi8vbnQuYWRkKG5ldyBOb2RlRWxlbWVudCgnc3Nzc3MyJykpO1xuLy9jb25zb2xlLmxvZygnYWZ0ZXInLGVsZSk7XG4vL2NvbnNvbGUuZGlyKG50LnRvU3RyaW5nKCkpO1xuLy9jb25zb2xlLmxvZyhcImNvbnN0cnVjdG9yXCIsbnQuY29uc3RydWN0b3IubmFtZS50b1N0cmluZygpKTtcbi8vY29uc29sZS5sb2cobnQpO1xuXG5cbnZhciBjb25maWcgPSB7XG4gICAgICAgIGRhdGE6IHt9LFxuICAgICAgICBtZXRob2RUeXBlOiAnR0VUJyxcbiAgICAgICAgd3JhcHBlcjogJ2JvZHknXG4gICAgfSwgbGFzdENsaWNrID0ge30sIG5vZGVUcmVlLFxuICAgIHJlZm9ybWVyRGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cblxuICAgICAgICBkYXRhWydhY3Rpb25OYW1lJ10gPSBkYXRhLnF1aXp6ZXMubGVuZ3RoID4gMCA/IFwiVXBkYXRlXCIgOiBcIlNhdmVcIjtcblxuICAgICAgICBpZiAoIWRhdGEucXVpenplcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBkZW1vUXVpeiA9IHtxdWl6OiBleGFtcGxlfTtcbiAgICAgICAgICAgIGRhdGEucXVpenplcy5wdXNoKGRlbW9RdWl6KTtcbiAgICAgICAgICAgIC8vY29uZmlnLm1ldGhvZFR5cGUgPSAnUE9TVCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcubWV0aG9kVHlwZSA9ICdQVVQnO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YS5xdWl6emVzWzBdLnF1aXoucXVlc3Rpb25zWzBdLmlzQWN0aXZlID0gdHJ1ZTtcblxuXG4gICAgICAgIHJldHVybiB7Zm9ybTogZGF0YX07XG4gICAgfSxcblxuICAgIHJlVGVtcGxhdGUgPSBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICB2YXIgZGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgICAgICB2YXIgbnQgPSBuZXcgTm9kZVRyZWUobnVsbCk7XG4gICAgICAgIG50LnRlbXBsYXRlID0gJCgnI3F1aXp6ZXMtZ3JvdXAtMCcpO1xuICAgICAgICBudC50ZW1wbGF0ZUlkID0gJyNxdWl6emVzLWdyb3VwLTAnO1xuXG5cbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZGF0YS5xdWl6emVzWzBdLnF1aXoucXVlc3Rpb25zLmxlbmd0aDsgaWR4KyspIHtcbi8vICAgICAgICAgICAgZGF0YS5xdWl6emVzW2lkeF0uaW5kZXggPSBpZHg7ICAvLyBoYW5kbGViYXIgaGF2ZSBiZWVuIGFkZGVkIGhpbmRleCBhbiBvaW5kZXguXG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkVHJlZSA9IG5ldyBOb2RlVHJlZShudCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY1QgPSAkKCcjZ3JvdXAtcGFuZS0wLScgKyBpZHgpO1xuICAgICAgICAgICAgICAgIGNoaWxkVHJlZS50ZW1wbGF0ZSA9IGNUO1xuICAgICAgICAgICAgICAgIGNoaWxkVHJlZS50ZW1wbGF0ZUlkID0gJyNncm91cC1wYW5lLTAtJyArIGlkeDtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFF1aXogPSBkYXRhLnF1aXp6ZXNbMF0ucXVpei5xdWVzdGlvbnNbaWR4XTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGN1cnJlbnRRdWl6LmFuc3dlcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZEVsZW1lbnRUZW1wbGF0ZSA9ICQoJyNncm91cC1wYW5lLXN1Yi0nICsgaWR4ICsgJy0nICsgaik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRFbGVtZW50ID0gbmV3IE5vZGVFbGVtZW50KCQoY2hpbGRFbGVtZW50VGVtcGxhdGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkRWxlbWVudC50ZW1wbGF0ZUlkID0gJyNncm91cC1wYW5lLXN1Yi0nICsgaWR4ICsgJy0nICsgajtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkVHJlZS5hZGQoY2hpbGRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVUZW1wbGF0ZScsIG50KTtcbiAgICAgICAgbm9kZVRyZWUgPSBudDtcbiAgICAgICAgbmV4dCgpO1xuICAgIH0sXG5cbiAgICBidWlsZFJlZHVjZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkYXRhW3Byb3BdO1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAvL2J1aWxkUmVkdWNlKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZENoaWxkTm9kZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgLy8gY2FzZSBpbmRleCA9PT0gMCA6IHRhYiBwYW5lbFxuICAgICAgICAvLyBjYXNlIGluZGV4ID09PSAxIDogZ3JvdXBzXG4gICAgICAgIC8vIGNhc2UgaW5kZXggPj0xIDogZ3JvdXBcblxuICAgICAgICAvLyBjcmVhdGUgdGVtcGxhdGUgd2l0aCBkYXRhLnByb3BlcnR5XG4gICAgICAgIC8vIHRlbXBsYXRlIGFwcGVuZFxuXG4gICAgICAgIC8vIGNvbWJpbmcgdGFyZ2V0IHdpdGggYWN0aW9uXG4gICAgICAgIC8vIGV2ZW50cyBiaW5kIHdpdGggYnV0dG9uLlxuXG5cbiAgICAgICAgdmFyIHRhcmdldFN0cmluZyA9IHRhcmdldDtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0U3RyaW5nKTtcbiAgICAgICAgXG4gICAgICAgIHZhciB0ZW1wbGF0ZUNsb25lLG5ld0luZGV4LHBhcmVudCxpbmRleEFycmF5LG5ld0lkLHRlbXBOYW1lO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGlmICh0YXJnZXRTdHJpbmcuaW5kZXhPZignbmF2JykgPj0gMCkge1xuICAgICAgICAgICAgLy8gaGFuZGxlIHRyZWUgbm9kZSBub3cuXG5cbiAgICAgICAgICAgIHZhciBjbG9uZU5vZGUgPSBub2RlVHJlZS5jaGlsZHJlblswXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5vZGVUcmVlLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIHBhcmVudCA9IGNsb25lTm9kZS5wYXJlbnQ7XG4gICAgICAgICAgICB0ZW1wbGF0ZUNsb25lID0gZ2V0RW1wdHlOb2RlVGVtcGxhdGUoJChwYXJlbnQuY2hpbGRyZW5bMF0udGVtcGxhdGVJZCkuY2xvbmUoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRlbXBsYXRlQ2xvbmVcIix0ZW1wbGF0ZUNsb25lKTtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZU5hdkNsb25lID0gKCQoJyNxdWl6emVzLWdyb3Vwcy1uYXYgbGknKS5maXJzdCgpLmNsb25lKCkpO1xuICAgICAgICAgICAgbmV3SW5kZXggPSBwYXJlbnQuY2hpbGRyZW5bMF0udGVtcGxhdGVJZDsvLyAjc3ViLTAtMC0wLS4uLiAgd2hlbiBub2RlVHJlZS50ZW1wbGF0ZUlkID0nJztcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbkluZGV4ID0gcGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKG5ld0luZGV4LmluZGV4T2YoJyMnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSBuZXdJbmRleC5zbGljZShuZXdJbmRleC5pbmRleE9mKCcjJykgKyAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5kZXhBcnJheSA9IG5ld0luZGV4LnNwbGl0KCctJyk7XG4gICAgICAgICAgICBuZXdJZCA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbmRleEFycmF5Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIG5ld0lkICs9IGluZGV4QXJyYXlbaV0gKyBcIi1cIjtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBuZXdJZCArPSBjaGlsZHJlbkluZGV4O1xuXG5cbiAgICAgICAgICAgICQodGVtcGxhdGVDbG9uZSkuYXR0cignaWQnLCBuZXdJZCk7XG5cbiAgICAgICAgICAgICQodGVtcGxhdGVDbG9uZSkuZmluZCgnI29wdGlvbnMtZ3JvdXAtcGFuZS1zdWItMC0wLXdyYXBwZXIgLmdyb3VwLXBhbmUtc3ViJykuZWFjaChmdW5jdGlvbiAoaWR4LCBlbGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcElkID0gJChlbGUpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgdmFyIGlkQXJyYXkgPSB0ZW1wSWQuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkKGVsZSkuZmluZCgnYnV0dG9uJykuYXR0cignZGF0YS10YXJnZXQnLCAnI2dyb3VwLXBhbmUtc3ViLScgKyBjaGlsZHJlbkluZGV4ICsgJy0nICsgaWR4KTtcbiAgICAgICAgICAgICAgICAkKGVsZSkuYXR0cignaWQnLCAnZ3JvdXAtcGFuZS1zdWItJyArIGNoaWxkcmVuSW5kZXggKyAnLScgKyBpZEFycmF5W2lkQXJyYXkubGVuZ3RoIC0gMV0pO1xuXG4gICAgICAgICAgICAgICAgLy8gdmFyIHRlbXBOYW1lID0gJChlbGUpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICB0ZW1wTmFtZSA9IFwicXVpenplc1tcIiArIGNoaWxkcmVuSW5kZXggKyBcIl1bYW5zd2Vyc11bXCIgKyBpZHggKyBcIl1bY29ycmVjdF1cIjtcbiAgICAgICAgICAgICAgICAkKGVsZSkuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuYXR0cignbmFtZScsIHRlbXBOYW1lKTtcblxuICAgICAgICAgICAgICAgIC8vIHZhciB0ZW1wTmFtZSA9ICQoZWxlKS5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICB0ZW1wTmFtZSA9IFwicXVpenplc1tcIiArIGNoaWxkcmVuSW5kZXggKyBcIl1bYW5zd2Vyc11bXCIgKyBpZHggKyBcIl1bb3B0aW9uXVwiO1xuICAgICAgICAgICAgICAgICQoZWxlKS5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmF0dHIoJ25hbWUnLCB0ZW1wTmFtZSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoaWxkcmVuSW5kZXgnLGNoaWxkcmVuSW5kZXgpO1xuICAgICAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKCcuZ3JvdXAtcGFuZS1zdWItYWRkLWJ0bicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtdGFyZ2V0JywgJyNncm91cC1wYW5lLTAtJyArIGNoaWxkcmVuSW5kZXggKyAnLTAnKTtcbiAgICAgICAgICAgICQodGVtcGxhdGVDbG9uZSkuZmluZCgnLmdyb3VwLXBhbmUtcmVtb3ZlLWJ0bicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtdGFyZ2V0JywnI2dyb3VwLXBhbmUtMC0nK2NoaWxkcmVuSW5kZXgpO1xuXG5cblxuXG4gICAgICAgICAgICB2YXIgbmV3VHJlZSA9IG5ldyBOb2RlVHJlZSgpO1xuICAgICAgICAgICAgbmV3VHJlZS5jaGlsZHJlbiA9IHBhcmVudC5jaGlsZHJlblswXS5jaGlsZHJlbi5zbGljZSgwKTtcbiAgICAgICAgICAgIG5ld1RyZWUuZWxlbWVudHMgPSBwYXJlbnQuY2hpbGRyZW5bMF0uZWxlbWVudHMuc2xpY2UoMCk7XG5cbiAgICAgICAgICAgIC8vIHdhbGsgdGhyb3VnaCB0aGUgY2xvbmVkIHRyZWVcbiAgICAgICAgICAgIGZvciAodmFyIGlsID0gMDsgaWwgPCBuZXdUcmVlLmNoaWxkcmVuLmxlbmd0aDsgaWwrKykge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IG5ld1RyZWUuY2hpbGRyZW5baWxdO1xuICAgICAgICAgICAgICAgIHZhciBpZEFycmF5ID0gY2hpbGQudGVtcGxhdGVJZC5zcGxpdCgnLScpO1xuICAgICAgICAgICAgICAgIGlkQXJyYXlbaWRBcnJheS5sZW5ndGggLSAyXSA9IGNoaWxkcmVuSW5kZXg7XG4gICAgICAgICAgICAgICAgY2hpbGQudGVtcGxhdGVJZCA9IGlkQXJyYXkuam9pbignLScpO1xuICAgICAgICAgICAgICAgIGNoaWxkLnRlbXBsYXRlID0gJChjaGlsZC50ZW1wbGF0ZUlkKTtcbiAgICAgICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSBuZXdUcmVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaXggPSAwOyBpeCA8IG5ld1RyZWUuZWxlbWVudHMubGVuZ3RoOyBpeCsrKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBuZXdUcmVlLmVsZW1lbnRzW2l4XTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkQXJyYXkgPSBlbGVtZW50LnRlbXBsYXRlSWQuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgICAgICAgICAgaWRBcnJheVtpZEFycmF5Lmxlbmd0aCAtIDJdID0gY2hpbGRyZW5JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50ZW1wbGF0ZUlkID0gaWRBcnJheS5qb2luKCctJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudGVtcGxhdGUgPSAkKGVsZW1lbnQudGVtcGxhdGVJZCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50ID0gbmV3VHJlZTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgbmV3VHJlZS50ZW1wbGF0ZSA9ICQodGVtcGxhdGVDbG9uZSk7XG4gICAgICAgICAgICBuZXdUcmVlLnRlbXBsYXRlSWQgPSAnIycgKyBuZXdJZDtcblxuICAgICAgICAgICAgLy8gYXBwZW5kIG5hdiBsaVxuXG4gICAgICAgICAgICAkKCcjcXVpenplcy1ncm91cHMtbmF2IGxpJykuZWFjaChmdW5jdGlvbiAoaWR4LCBlbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJChlbGUpLmhhc0NsYXNzKCdhY3RpdmUnKSkgJChlbGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0ZW1wbGF0ZU5hdkNsb25lKS5maW5kKCdhJykuaHRtbChjaGlsZHJlbkluZGV4ICsgMSkuYXR0cignaHJlZicsIG5ld1RyZWUudGVtcGxhdGVJZCk7XG4gICAgICAgICAgICAkKHRlbXBsYXRlTmF2Q2xvbmUpLmF0dHIoJ2lkJywnZ3JvdXAtbmF2LScrY2hpbGRyZW5JbmRleCk7XG5cblxuICAgICAgICAgICAgJCgnI3F1aXp6ZXMtZ3JvdXBzLW5hdicpLmFwcGVuZCh0ZW1wbGF0ZU5hdkNsb25lKTtcbi8vICAgICAgICAgICAgJCh0ZW1wbGF0ZU5hdkNsb25lKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vL1xuXG4gICAgICAgICAgICAvLyBhcHBlbmQgY29udGVudFxuLy8gICAgICAgICAgICAkKCcjcXVpenplcy1ncm91cC0wIC50YWItcGFuZScpLmVhY2goZnVuY3Rpb24gKGlkeCwgZWxlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAoJChlbGUpLmhhc0NsYXNzKCdhY3RpdmUnKSkgJChlbGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKHBhcmVudC50ZW1wbGF0ZUlkKTtcblxuXG4gICAgICAgICAgICAkKHBhcmVudC50ZW1wbGF0ZUlkKS5hcHBlbmQobmV3VHJlZS50ZW1wbGF0ZSk7XG4gICAgICAgICAgICAvLyQobmV3VHJlZS50ZW1wbGF0ZSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnI3F1aXp6ZXMtZ3JvdXBzLW5hdiBsaTplcSgnKyhjaGlsZHJlbkluZGV4KSsnKSBhJykudGFiKCdzaG93Jyk7XG4gICAgICAgICAgICBwYXJlbnQuYWRkKG5ld1RyZWUpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBoYW5kbGUgZWxlbWVudCBub2RlIG5vdy5cbiAgICAgICAgICAgIHZhciB3aGljaE5vZGUgPSBnZXRDaGlsZE5vZGUodGFyZ2V0U3RyaW5nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3aGljaCcsIHdoaWNoTm9kZSk7XG4gICAgICAgICAgICBwYXJlbnQgPSB3aGljaE5vZGUucGFyZW50O1xuICAgICAgICAgICAgdGVtcGxhdGVDbG9uZSA9IGdldEVtcHR5Tm9kZVRlbXBsYXRlKCQocGFyZW50LmVsZW1lbnRzWzBdLnRlbXBsYXRlSWQpLmNsb25lKCkpO1xuICAgICAgICAgICAgbmV3SW5kZXggPSBwYXJlbnQuZWxlbWVudHNbMF0udGVtcGxhdGVJZDtcbiAgICAgICAgICAgIHZhciBlbGVtZW50c0luZGV4ID0gcGFyZW50LmVsZW1lbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKG5ld0luZGV4LmluZGV4T2YoJyMnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdpbmRleFwiLCBuZXdJbmRleC5pbmRleE9mKCcjJykpO1xuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gbmV3SW5kZXguc2xpY2UobmV3SW5kZXguaW5kZXhPZignIycpICsgMSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdpbmRleFwiLCBuZXdJbmRleCk7XG4gICAgICAgICAgICBpbmRleEFycmF5ID0gbmV3SW5kZXguc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIG5ld0lkID0gJyc7XG4gICAgICAgICAgICBmb3IgKHZhciBpbSA9IDA7IGltIDwgaW5kZXhBcnJheS5sZW5ndGggLSAxOyBpbSsrKSB7XG4gICAgICAgICAgICAgICAgbmV3SWQgKz0gaW5kZXhBcnJheVtpbV0gKyBcIi1cIjtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBuZXdJZCArPSBlbGVtZW50c0luZGV4O1xuXG5cbiAgICAgICAgICAgIHZhciBuZXdFbGVtZW50ID0gbmV3IE5vZGVFbGVtZW50KCk7XG5cbiAgICAgICAgICAgIC8vIHNldCBuYW1lIGFuZCBpZCB0byBpbnB1dC5cblxuICAgICAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5hdHRyKCdpZCcsIG5ld0lkKS5maW5kKCdidXR0b24nKS5hdHRyKCdkYXRhLXRhcmdldCcsICcjJyArIG5ld0lkKTtcblxuICAgICAgICAgICAgLy8gdGVtcE5hbWUgPSAkKHRlbXBsYXRlQ2xvbmUpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgIHRlbXBOYW1lID0gXCJxdWl6emVzW1wiICsgcGFyZW50LmluZGV4ICsgXCJdW2Fuc3dlcnNdW1wiICsgZWxlbWVudHNJbmRleCArIFwiXVtjb3JyZWN0XVwiO1xuICAgICAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5hdHRyKCduYW1lJywgdGVtcE5hbWUpO1xuXG4gICAgICAgICAgICAvLyB0ZW1wTmFtZSA9ICQodGVtcGxhdGVDbG9uZSkuZmluZCgnaW5wdXRbdHlwZT1cInRleHRcIl0nKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICB0ZW1wTmFtZSA9IFwicXVpenplc1tcIiArIHBhcmVudC5pbmRleCArIFwiXVthbnN3ZXJzXVtcIiArIGVsZW1lbnRzSW5kZXggKyBcIl1bb3B0aW9uXVwiO1xuICAgICAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmF0dHIoJ25hbWUnLCB0ZW1wTmFtZSk7XG5cbiAgICAgICAgICAgIG5ld0VsZW1lbnQudGVtcGxhdGUgPSAkKHRlbXBsYXRlQ2xvbmUpO1xuXG4gICAgICAgICAgICBuZXdFbGVtZW50LnRlbXBsYXRlSWQgPSAnIycgKyBuZXdJZDtcblxuXG4gICAgICAgICAgICAkKHBhcmVudC50ZW1wbGF0ZUlkICsgJyAub3B0aW9ucy1ncm91cCcpLmFwcGVuZChuZXdFbGVtZW50LnRlbXBsYXRlKTtcbiAgICAgICAgICAgIHBhcmVudC5hZGQobmV3RWxlbWVudCk7XG5cbiAgICAgICAgfVxuXG5cbiAgICB9LFxuICAgIGdldEVtcHR5Tm9kZVRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlQ2xvbmUpIHtcbiAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKCdpbnB1dCcpLnZhbCgnJykuYXR0cigndmFsdWUnLCAnJyk7XG4gICAgICAgICQodGVtcGxhdGVDbG9uZSkuZmluZCgndGV4dGFyZWEnKS5odG1sKCcnKTtcbiAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKFwiW3R5cGU9J2NoZWNrYm94J11cIikucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuICQodGVtcGxhdGVDbG9uZSk7XG4gICAgfSxcbiAgICBnZXRDaGlsZE5vZGUgPSBmdW5jdGlvbiAodGFyZ2V0U3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKHRhcmdldFN0cmluZy5sYXN0SW5kZXhPZignc3ViJykgPj0gMClcbiAgICAgICAgICAgIHRhcmdldFN0cmluZyA9IHRhcmdldFN0cmluZy5zdWJzdHIodGFyZ2V0U3RyaW5nLmxhc3RJbmRleE9mKCdzdWItJykgKyA0KTtcblxuICAgICAgICBpZiAodGFyZ2V0U3RyaW5nLmluZGV4T2YoJ2dyb3VwLXBhbmUtMCcpID49IDApXG4gICAgICAgICAgICB0YXJnZXRTdHJpbmcgPSB0YXJnZXRTdHJpbmcuc3Vic3RyKHRhcmdldFN0cmluZy5pbmRleE9mKCdncm91cC1wYW5lLTAtJykgKyAxMyk7XG5cbiAgICAgICAgdmFyIGluZGV4QXJyYXkgPSB0YXJnZXRTdHJpbmcuc3BsaXQoJy0nKTtcblxuICAgICAgICB2YXIgc3RyaW5nVGFyZ2V0ID0gXCJub2RlVHJlZVwiO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaW5kZXhBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGluZGV4QXJyYXlbal0gIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaiAlIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nVGFyZ2V0ICs9IFwiLmVsZW1lbnRzW1wiICsgaW5kZXhBcnJheVtqXSArIFwiXVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ1RhcmdldCArPSBcIi5jaGlsZHJlbltcIiArIGluZGV4QXJyYXlbal0gKyBcIl1cIjtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc29sZS5sb2coc3RyaW5nVGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuICAgZXZhbChzdHJpbmdUYXJnZXQpO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGROb2RlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuXG4gICAgICAgIC8vIHN1Yi0xLTIgIGxldmVsIDEgc2Vjb25kIG9uZS5cblxuICAgICAgICB2YXIgdGFyZ2V0cyA9ICQodGFyZ2V0KTtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0cyk7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhcmdldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmaW5hbEZuID0gZnVuY3Rpb24gKHRyZWVBcnJheSwgd2hpY2hJbmRleCx0eXBlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cod2hpY2hJbmRleCAhPT0gMCk7XG5cbiAgICAgICAgICAgICAgICBpZih3aGljaEluZGV4ICE9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZSA9PT0gJ05vZGVUcmVlJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih3aGljaEluZGV4IDwgdHJlZUFycmF5Lmxlbmd0aC0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcXVpenplcy1ncm91cHMtbmF2IGxpOmVxKCcrd2hpY2hJbmRleCsnKSBhJykudGFiKCdzaG93Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHdoaWNoSW5kZXgtMSA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNxdWl6emVzLWdyb3Vwcy1uYXYgbGk6ZXEoJysod2hpY2hJbmRleC0xKSsnKSBhJykudGFiKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcXVpenplcy1ncm91cHMtbmF2IGxpOmVxKDApIGEnKS50YWIoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRyZWVBcnJheS5zcGxpY2Uod2hpY2hJbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRTdHJpbmcgPSAkKHRhcmdldHNbaV0pLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGFyZ2V0U3RyaW5nKTtcbiAgICAgICAgICAgICAgICB2YXIgd2hpY2hOb2RlID0gZ2V0Q2hpbGROb2RlKHRhcmdldFN0cmluZyk7XG4gICAgICAgICAgICAgICAgdmFyIHdoaWNoSW5kZXggPSB3aGljaE5vZGUuaW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudFRyZWUgPSB3aGljaE5vZGUucGFyZW50O1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wTmFtZSxpZHg7XG5cbiAgICAgICAgICAgICAgICBpZiAod2hpY2hJbmRleCAhPT0gMCkgJCgnZGl2JykucmVtb3ZlKHdoaWNoTm9kZS50ZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgICAgIGlmKHdoaWNoTm9kZS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnTm9kZUVsZW1lbnQnKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpZHggPSB3aGljaEluZGV4KzE7IGlkeCA8IHBhcmVudFRyZWUuZWxlbWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmKGlkeCA9PT0gd2hpY2hJbmRleCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRUcmVlLmVsZW1lbnRzW2lkeF0uaW5kZXggPSBpZHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lkID0gaWR4IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VGVtcGxhdGVJZCA9ICdncm91cC1wYW5lLXN1Yi0nICsgcGFyZW50VHJlZS5pbmRleCArICctJyArIG5ld0lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wT2xkSWRPYmplY3QgPSAkKHBhcmVudFRyZWUuZWxlbWVudHNbaWR4XS50ZW1wbGF0ZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wT2xkSWRPYmplY3QuYXR0cignaWQnLCBuZXdUZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1RlbXBsYXRlSWQgPSBcIiNcIiArIG5ld1RlbXBsYXRlSWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wT2xkSWRPYmplY3QuZmluZCgnYnV0dG9uJykuYXR0cignZGF0YS10YXJnZXQnLCBuZXdUZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciB0ZW1wTmFtZSA9IHRlbXBPbGRJZE9iamVjdC5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE5hbWUgPSBcInF1aXp6ZXNbXCIgKyBwYXJlbnRUcmVlLmluZGV4ICsgXCJdW2Fuc3dlcnNdW1wiICsgbmV3SWQgKyBcIl1bY29ycmVjdF1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wT2xkSWRPYmplY3QuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuYXR0cignbmFtZScsIHRlbXBOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciB0ZW1wTmFtZSA9IHRlbXBPbGRJZE9iamVjdC5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTmFtZSA9IFwicXVpenplc1tcIiArIHBhcmVudFRyZWUuaW5kZXggKyBcIl1bYW5zd2Vyc11bXCIgKyBuZXdJZCArIFwiXVtvcHRpb25dXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE9sZElkT2JqZWN0LmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJykuYXR0cignbmFtZScsIHRlbXBOYW1lKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VHJlZS5lbGVtZW50c1tpZHhdLnRlbXBsYXRlSWQgPSBuZXdUZW1wbGF0ZUlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gcGFyZW50VHJlZS5lbGVtZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUocGFyZW50VHJlZS5lbGVtZW50cywgd2hpY2hJbmRleCwnTm9kZUVsZW1lbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYod2hpY2hOb2RlLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdOb2RlVHJlZScpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd2hpY2hJbmRleDonLHdoaWNoSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZih3aGljaEluZGV4ICE9PSAwKSAkKCcjZ3JvdXAtbmF2LScrd2hpY2hJbmRleCkucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpZHggPSB3aGljaEluZGV4OyBpZHggPCBwYXJlbnRUcmVlLmNoaWxkcmVuLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlkeCA9PT0gd2hpY2hJbmRleCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID09PSBwYXJlbnRUcmVlLmNoaWxkcmVuLmxlbmd0aCAtIDEgfHwgaWR4ID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUocGFyZW50VHJlZS5jaGlsZHJlbiwgd2hpY2hJbmRleCwnTm9kZVRyZWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZihpZHggPT09IHdoaWNoSW5kZXgpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNncm91cC1uYXYtJytpZHgpLmNoaWxkcmVuKCdhJykuaHRtbChpZHgpLmF0dHIoJ2hyZWYnLCcjZ3JvdXAtcGFuZS0wLScrKGlkeC0xKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2dyb3VwLW5hdi0nK2lkeCkuYXR0cignaWQnLCdncm91cC1uYXYtJysoaWR4LTEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjZ3JvdXAtcGFuZS0wLScraWR4KS5hdHRyKCdpZCcsJ2dyb3VwLXBhbmUtMC0nKyhpZHgtMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNncm91cC1wYW5lLTAtJytpZHgpLmZpbmQoJy5ncm91cC1wYW5lLXJlbW92ZS1idG4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS10YXJnZXQnLCcjZ3JvdXAtcGFuZS0wLScrKGlkeC0xKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VHJlZS5jaGlsZHJlbltpZHhdLmluZGV4ID0gaWR4LTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VHJlZS5jaGlsZHJlbltpZHhdLnRlbXBsYXRlSWQgID0gJyNncm91cC1wYW5lLTAtJysoaWR4LTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZFRyZWUgPSBwYXJlbnRUcmVlLmNoaWxkcmVuW2lkeF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgY2lkeCA9IDAgOyBjaWR4IDwgY2hpbGRUcmVlLmVsZW1lbnRzLmxlbmd0aDsgY2lkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmKGlkeCA9PT0gd2hpY2hJbmRleCkgY29udGludWU7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lkID0gY2hpbGRUcmVlLmVsZW1lbnRzW2NpZHhdLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1RlbXBsYXRlSWQgPSAnZ3JvdXAtcGFuZS1zdWItJyArIGNoaWxkVHJlZS5pbmRleCArICctJyArIG5ld0lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBPbGRJZE9iamVjdCA9ICQoY2hpbGRUcmVlLmVsZW1lbnRzW2NpZHhdLnRlbXBsYXRlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE9sZElkT2JqZWN0LmF0dHIoJ2lkJywgbmV3VGVtcGxhdGVJZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1RlbXBsYXRlSWQgPSBcIiNcIiArIG5ld1RlbXBsYXRlSWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBPbGRJZE9iamVjdC5maW5kKCdidXR0b24nKS5hdHRyKCdkYXRhLXRhcmdldCcsIG5ld1RlbXBsYXRlSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgdGVtcE5hbWUgPSB0ZW1wT2xkSWRPYmplY3QuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE5hbWUgPSBcInF1aXp6ZXNbXCIgKyBjaGlsZFRyZWUuaW5kZXggKyBcIl1bYW5zd2Vyc11bXCIgKyBuZXdJZCArIFwiXVtjb3JyZWN0XVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE9sZElkT2JqZWN0LmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmF0dHIoJ25hbWUnLCB0ZW1wTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciB0ZW1wTmFtZSA9IHRlbXBPbGRJZE9iamVjdC5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBOYW1lID0gXCJxdWl6emVzW1wiICsgY2hpbGRUcmVlLmluZGV4ICsgXCJdW2Fuc3dlcnNdW1wiICsgbmV3SWQgKyBcIl1bb3B0aW9uXVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE9sZElkT2JqZWN0LmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJykuYXR0cignbmFtZScsIHRlbXBOYW1lKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFRyZWUuZWxlbWVudHNbY2lkeF0udGVtcGxhdGVJZCA9IG5ld1RlbXBsYXRlSWQ7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID09PSBwYXJlbnRUcmVlLmNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZShwYXJlbnRUcmVlLmNoaWxkcmVuLCB3aGljaEluZGV4LCdOb2RlVHJlZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9KShmaW5hbEZuKTtcblxuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG5vZGVUcmVlKTtcbiAgICAgICAgfVxuXG5cbiAgICB9LFxuICAgIGhhbmRsZU1vdXNlQ2xpY2tGYWN0b3J5ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOy8vIEBUT0RPIHVzZSBidXR0b24gdHlwZSBpbnN0ZWFkXG4gICAgICAgIGNvbnNvbGUubG9nKCdwcmV2ZW50RGVmYXVsdCcpO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICB2YXIgT2JqZWN0VGFyZ2V0ID0gJCh0YXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG5cbiAgICAgICAgc3dpdGNoICgkKHRhcmdldCkuYXR0cignZGF0YS1hY3Rpb24nKSkge1xuICAgICAgICAgICAgY2FzZSAgJ2FkZCc6XG4gICAgICAgICAgICAgICAgYWRkQ2hpbGROb2RlKE9iamVjdFRhcmdldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAncmVtb3ZlJzpcbiAgICAgICAgICAgICAgICByZW1vdmVDaGlsZE5vZGUoT2JqZWN0VGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdENsaWNrID0gZS50YXJnZXQ7XG5cbiAgICB9LFxuICAgIGlzQXJyYXkgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfTtcblxuXG5leHBvcnRzLmZvcm1CdWlsZCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAvLyBlYWNoIHByb3BlcnR5IGluIGRhdGFcbiAgICAvLyBhZGQgbmV3IHRhYiAsIGFkZCBmb3JtLCBhZGQgc3VibWl0IGJ1dHRvbiAsYWRkIGVsZW0gYnV0dG9uXG4gICAgLy8gZWFjaCBwcm9wZXJ0eSBpbiBlbGVtZW50ICwgaXNBcnJheVxuICAgIC8vIGFkZCBwYW5lbCBlbGVtZW50IChlcS4gcmVtb3ZlIGN1ciBlbGVtIGJ1dHRvbilcbiAgICAvLyBlYWNoIHByb3BlcnR5IGluIGVsZW0gIGlzQXJyYXlcbiAgICAvLyBhZGQgdGV4dEFyZWEgLCBjaGVja0JveCAsIG9yIHJhZGlvc0dyb3VwXG4gICAgLy9cbiAgICAvL0BUT0RPIHVzZSBleHRlbmQgZm4uXG4gICAgY29uZmlnLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgY29uZmlnLndyYXBwZXIgPSBvcHRpb25zLndyYXBwZXI7XG4gICAgY29uZmlnLmZvcm1Cb2R5ID0gb3B0aW9ucy5mb3JtQm9keTtcbiAgICB2YXIgZGF0YSA9IGNvbmZpZy5kYXRhLFxuICAgICAgICBxdWVzdGlvbnMgPSBkYXRhWydxdWVzdGlvbnMnXTtcbiAgICBjb25zb2xlLmxvZyhcImRhdGEucXVpenplc1wiLCBkYXRhLnF1aXp6ZXMpO1xuICAgIGRhdGEgPSByZWZvcm1lckRhdGEoZGF0YSk7XG5cbiAgICB2YXIgd3JhcHBlciA9ICQoY29uZmlnLmZvcm1Cb2R5KTtcblxuICAgIHZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vLi4vdGVtcGxhdGVzL3F1aXp6ZXNGb3JtLmhhbmRsZWJhcnMnKTtcblxuICAgIGJ1aWxkUmVkdWNlKGRhdGEpO1xuXG4gICAgdmFyIGh0bWwgPSB0ZW1wbGF0ZShkYXRhKTtcblxuICAgIHdyYXBwZXIuYXBwZW5kKGh0bWwpO1xuXG5cbiAgICByZVRlbXBsYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsIGNvbmZpZy5mb3JtQm9keSArIFwiIGJ1dHRvblt0eXBlIT0nc3VibWl0J11cIiwge2xhc3RDbGljazogbGFzdENsaWNrfSwgaGFuZGxlTW91c2VDbGlja0ZhY3RvcnkpO1xuXG4gICAgICAgIHdyYXBwZXIub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBmb3JtID0gJChjb25maWcuZm9ybUJvZHkpO1xuXG4gICAgICAgICAgICB2YXIgc2VyaWFsaXplZEFycmF5O1xuXG4gICAgICAgICAgICB2YXIgYWpheFVSTCA9ICcnO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5tZXRob2RUeXBlID09PSAnUFVUJykge1xuICAgICAgICAgICAgICAgIGFqYXhVUkwgPSAkKGZvcm0pLmF0dHIoJ2FjdGlvbicpICsgJy8nICsgZGF0YS5mb3JtLnF1aXp6ZXNbMF0ucXVpei5faWQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoJChmb3JtKS5zZXJpYWxpemUoKSkpO1xuICAgICAgICAgICAgICAgIC8vc2VyaWFsaXplZEFycmF5ID0gc2VyaWFsaXplSlNPTigkKGZvcm0pLnNlcmlhbGl6ZUFycmF5KCkpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFqYXhVUkwgPSAkKGZvcm0pLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgICAgICAgIC8vc2VyaWFsaXplZEFycmF5ID0gJChmb3JtKS5zZXJpYWxpemUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRBcnJheSA9ICQoZm9ybSkuc2VyaWFsaXplKCk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6Y29uZmlnLm1ldGhvZFR5cGUsXG4gICAgICAgICAgICAgICAgdXJsOiBhamF4VVJMLFxuICAgICAgICAgICAgICAgIGRhdGE6IHNlcmlhbGl6ZWRBcnJheSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNvbil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICQoJyNxdWl6TXNnIHVsJykuYXBwZW5kKCQoJzxsaT4gYXJ0aWNsZSAnK2pzb24uYXJ0X2lkKycgdXBkYXRlZCE8L2xpPicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpLnNob3coKS5mYWRlSW4oKTtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbn07XG5cblxudmFyIHNlcmlhbGl6ZUpTT04gPSBmdW5jdGlvbiAoZGF0YUFycmF5KSB7XG4gICAgdmFyIHNlcmlhbGl6ZWRBcnJheSA9IHt9O1xuICAgIHZhciB0ZW1wT2JqZWN0SWQgPSBcIjBcIjtcbiAgICB2YXIgdGVtcDJPYmplY3RJZCA9IFwiMFwiO1xuICAgIHZhciBoYXNNYXRjaGVzLCBoYXNQcm9wZXJ0eU1hdGNoZXM7XG4gICAgdmFyIHRlbXBPYmplY3QgPSB7fTtcbiAgICB2YXIgdGVtcDJPYmplY3QgPSB7aW5kZXg6IC0xfTtcbiAgICB2YXIga2V5LCBzdWJLZXksIHN1YklkLHN1YnNLZXk7XG5cbiAgICAkLmVhY2goZGF0YUFycmF5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gdGhpcy5uYW1lLm1hdGNoKC9eKC4rPylcXFsoXFxkKylcXF1cXFsoLispXFxdKyQvaSlcbiAgICAgICAgICAgICwgdmFsdWUgPSB0aGlzLnZhbHVlO1xuXG4gICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICBoYXNNYXRjaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHNlcmlhbGl6ZWRBcnJheVtrZXldW3N1YklkXXtwb3MsIGFuc3dlcnNbXX1cbiAgICAgICAgICAgIHN1YktleSA9IG1hdGNoZXNbM107XG4gICAgICAgICAgICBzdWJJZCA9IG1hdGNoZXNbMl07XG4gICAgICAgICAgICBrZXkgPSBtYXRjaGVzWzFdO1xuXG4gICAgICAgICAgICBpZiAoISgga2V5IGluICBzZXJpYWxpemVkQXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgc2VyaWFsaXplZEFycmF5W2tleV0gPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy90ZW1wT2JqZWN0LmluZGV4ID0gc3ViSWQ7XG5cbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eU1hdGNoZXMgPSBzdWJLZXkubWF0Y2goL14oLis/KVxcXVxcWyhcXGQrKVxcXVxcWyguKykrJC9pKTtcblxuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHByb3BlcnR5TWF0Y2hlcyk7XG4gICAgICAgICAgICAvL0BUT0RPIGlmIG1vcmUgZGVlcGVyP1xuXG5cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBoYXNQcm9wZXJ0eU1hdGNoZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN1YnNLZXkgPSBwcm9wZXJ0eU1hdGNoZXNbMV07XG4gICAgICAgICAgICAgICAgdmFyIHN1YnNJZCA9IHByb3BlcnR5TWF0Y2hlc1syXTtcbiAgICAgICAgICAgICAgICB2YXIgc3Vic0tleU5hbWUgPSBwcm9wZXJ0eU1hdGNoZXNbM107XG5cbiAgICAgICAgICAgICAgICBpZiAoISggc3Vic0tleSBpbiAgdGVtcE9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9iamVjdFtzdWJzS2V5XSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cblxuLy8gICAgICAgICAgICAgICAgaWYoICEoc3Vic0lkID09PT0gdGVtcDJPYmplY3QuaW5kZXgpKXtcbi8vICAgICAgICAgICAgICAgICAgICBpZih0ZW1wMk9iamVjdC5pbmRleCE9PS0xKSB0ZW1wT2JqZWN0W3N1YnNLZXldLnB1c2godGVtcDJPYmplY3QpO1xuLy8gICAgICAgICAgICAgICAgICAgIHRlbXAyT2JqZWN0ID0ge307XG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcDJPYmplY3QuaW5kZXggPSBzdWJzSWQ7XG4vLyAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc3Vic0lkICE9PSB0ZW1wMk9iamVjdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmplY3Rbc3Vic0tleV0ucHVzaCh0ZW1wMk9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAyT2JqZWN0ID0ge307XG4gICAgICAgICAgICAgICAgICAgIHRlbXAyT2JqZWN0SWQgPSBzdWJzSWQ7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB0ZW1wMk9iamVjdFtzdWJzS2V5TmFtZV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoYXNQcm9wZXJ0eU1hdGNoZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqZWN0W3N1YktleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3RhcnQgZnJvbSBzdWJJZC5cbiAgICAgICAgICAgIGlmIChzdWJJZCAhPT0gdGVtcE9iamVjdElkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGVtcE9iamVjdElkLCBzdWJJZCk7XG4gICAgICAgICAgICAgICAgLy8gaW5zZXJ0IGFuZCBzdGFydCB0byBuZXh0IGxvb3BcblxuXG5cbiAgICAgICAgICAgICAgICBzZXJpYWxpemVkQXJyYXlba2V5XS5wdXNoKHRlbXBPYmplY3QpO1xuICAgICAgICAgICAgICAgIHRlbXBPYmplY3QgPSB7fTtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqZWN0SWQgPSBzdWJJZDtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoYXNNYXRjaGVzID0gdHJ1ZTtcblxuICAgICAgICAgICAgc2VyaWFsaXplZEFycmF5W3RoaXMubmFtZV0gPSB0aGlzLnZhbHVlIHx8ICcnO1xuICAgICAgICB9XG5cbiAgICB9KTtcbiAgICBpZiAoaGFzTWF0Y2hlcykge1xuICAgICAgICBpZihoYXNQcm9wZXJ0eU1hdGNoZXMpe1xuICAgICAgICAgICAgY29uc29sZS5sb2codGVtcDJPYmplY3QpO1xuICAgICAgICAgICAgdGVtcE9iamVjdFtzdWJzS2V5XS5wdXNoKHRlbXAyT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXJpYWxpemVkQXJyYXlba2V5XS5wdXNoKHRlbXBPYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gc2VyaWFsaXplZEFycmF5O1xufTsiLCJleHBvcnRzLmluaXQ9IGZ1bmN0aW9uKCl7XG4gICAgJCgnI2J1aWxkU2Nvcm0nKS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBhaWQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKTtcbiAgICAgICAgdmFyIGFqYXhVUkwgPSAnL3Njb3JtLycrYWlkKycvYnVpbGQnO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGFqYXhVUkwsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihqc29uKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhqc29uKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJyNkb3dubG9hZFNDT1JNJykub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgYWlkID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgICAgIHZhciBhamF4VVJMID0gJy9zY29ybS8nK2FpZCsnL2V4cG9ydFNDT1JNJztcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBhamF4VVJMLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNvbil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coanNvbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufTsiLCIvL01vZHVsZS5leHBvcnRzPSBmdW5jdGlvbigpe1xuLy9kZWZpbmUoJ19mb3Jtcy9fdmlkZW9zRm9ybScsIFsnZXhwb3J0cyddLCBmdW5jdGlvbihfX2V4cG9ydHNfX18pe1xuZXhwb3J0cy52aWRlb0luaXQ9IGZ1bmN0aW9uKCl7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIEBUT0RPICByZWZhY3RvclxuICAgICAgICAvKlxuICAgICAgICAgKiB7XG4gICAgICAgICAqICAgd3JhcHBlcl9uYW1lLFxuICAgICAgICAgKiAgIGdyb3VwX25hbWUsXG4gICAgICAgICAqICAgcHJvcGVydHlfbmFtZSxcbiAgICAgICAgICogICBidXR0b25faWQsXG4gICAgICAgICAqICAgYnV0dG9uX2RhdGEtdGFyZ2V0X2luZGV4XG4gICAgICAgICAqICAgY29udHJvbF9pZFxuICAgICAgICAgKiAgIGZvcm1fZWxlbWVudF90YWdOYW1lXG4gICAgICAgICAqICAgZm9ybV9pZFxuICAgICAgICAgKiB9XG4gICAgICAgICAqICovXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsJ2J1dHRvbi5yZW1vdmUtdmlkZW8tYnRuJyx7fSwgcmVtb3ZlVmlkZW9Gbik7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywnYnV0dG9uLnJlbW92ZS12aWRlby1idG4nLHt9LCByZW1vdmVWaWRlb0ZuKTtcblxuICAgICAgICAvLyQoJ2J1dHRvbi5yZW1vdmUtdmlkZW8tYnRuJykub24oJ2NsaWNrJyxyZW1vdmVWaWRlb0ZuKTtcbiAgICAgICAgLy8ganF1ZXJ5IDEuN1xuICAgICAgICAvLyQoJy5yZW1vdmUtdmlkZW8tYnRuJykubGl2ZSgnY2xpY2snLCByZW1vdmVWaWRlb0ZuKTtcblxuXG5cbiAgICAgICAgJCgnI3ZpZGVvRm9ybSAjYWRkJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAvL0BUT0RPIGZpcnN0IHdpdGggYXBwZW5kLlxuICAgICAgICAgICAgdmFyIGNvdW50ID0gJCgnLnZpZGVvLWdyb3VwJykubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0kKCcudmlkZW8tZ3JvdXAnKS5maXJzdCgpLmNsb25lKCk7XG4gICAgICAgICAgICAkKHRlbXBsYXRlKS5jaGlsZHJlbignLmNydWQtdmlkZW8tY29udHJvbCcpLnRvZ2dsZUNsYXNzKCdoaWRlJykuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9ICQodGVtcGxhdGUpLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5jaGlsZHJlbihcIltuYW1lXj0ndmlkZW9zJ11cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uID0gJCh0ZW1wbGF0ZSkuY2hpbGRyZW4oJy5jcnVkLXZpZGVvLWNvbnRyb2wnKS5jaGlsZHJlbigpLmNoaWxkcmVuKCcgYnV0dG9uJyk7XG4gICAgICAgICAgICBidXR0b24uYXR0cignaWQnLCd0ZW1wLXZpZGVvLWlkJyk7XG4gICAgICAgICAgICBidXR0b24uYXR0cignZGF0YS10YXJnZXQnLGNvdW50KTtcbiAgICAgICAgICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oaWR4LCBlbGUpe1xuICAgICAgICAgICAgICAgIHZhciBhdHRyX25hbWUgPSAkKGVsZSkuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgIHZhciB3b3JkX3N0YXJfYXQgPSBhdHRyX25hbWUuaW5kZXhPZignWycpO1xuICAgICAgICAgICAgICAgIHZhciB3b3JkX2VuZF9hdCA9IGF0dHJfbmFtZS5pbmRleE9mKCddJyk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld19hdHRyX25hbWUgPWF0dHJfbmFtZS5zdWJzdHIoMCwgd29yZF9zdGFyX2F0KzEpK2NvdW50KyBhdHRyX25hbWUuc3Vic3RyKHdvcmRfZW5kX2F0KTtcblxuICAgICAgICAgICAgICAgICQoZWxlKS5hdHRyKCduYW1lJywgbmV3X2F0dHJfbmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZigkKGVsZSkuaXMoJ3RleHRhcmVhJykpe1xuICAgICAgICAgICAgICAgICAgICAkKGVsZSkuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoJChlbGUpLmlzKCdpbnB1dCcpKXtcbiAgICAgICAgICAgICAgICAgICAgJChlbGUpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyN2aWRlb3MtZ3JvdXAnKS5hcHBlbmQodGVtcGxhdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKFwiI3ZpZGVvRm9ybSBidXR0b25bdHlwZT0nc3VibWl0J11cIikub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHZhciBmb3JtID0gJCgnI3ZpZGVvRm9ybScpO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSQoZm9ybSkuc2VyaWFsaXplKCk7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiAkKGZvcm0pLmF0dHIoJ2FjdGlvbicpLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNvbil7XG4gICAgICAgICAgICAgICAgICAgIGZsYXNoKCdzdWNjZXNzIHVwZGF0ZSB2aWRlby4nKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbi8vICAgICAgICAkKCcjdmlkZW9Gb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpe1xuLy8gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG5cbiAgICB2YXIgZmxhc2g9ZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgLy8gICAgJCgnLm1haW4tY29udGVudCcpLnByZXBlbmQoJCgnLmZhZGUuaW4uYWxlcnQtaW5mbycpKVxuXG4gICAgLy8gICAgICAgIC5mYWRlLmluLmFsZXJ0LmFsZXJ0LWRhbmdlclxuICAgICAgICAvLyAgICBidXR0b24uY2xvc2UodHlwZT0nYnV0dG9uJywgZGF0YS1kaXNtaXNzPSdhbGVydCcpIMOXXG4gICAgICAgIC8vICAgIHVsXG4gICAgICAgIC8vICAgIC0gZWFjaCBlcnJvciBpbiBlcnJvcnNcbiAgICAgICAgLy8gICAgbGkhPSBlcnJvclxuICAgIH07XG5cblxuICAgIHZhciByZW1vdmVWaWRlb0ZuID0gZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgICB2YXIgY3VycmVudEluZGV4PSAkKHRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKTtcbiAgICAgICAgY29uc29sZS5sb2coJCh0YXJnZXQpLmF0dHIoJ2lkJykpO1xuXG4gICAgICAgIGlmKCd0ZW1wLXZpZGVvLWlkJyA9PT0gJCh0YXJnZXQpLmF0dHIoJ2lkJykpe1xuICAgICAgICAgICAgJCgnLnZpZGVvLWdyb3VwJylbY3VycmVudEluZGV4XS5yZW1vdmUoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB2YXIgZm9ybSA9ICQoJyN2aWRlb0Zvcm0nKTtcbiAgICAgICAgICAgIHZhciB2aWRlb0lkID0gJCh0YXJnZXQpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJChmb3JtKS5hdHRyKCdhY3Rpb24nKSsgXCIvXCIrdmlkZW9JZCxcbiAgICAgICAgICAgICAgICB0eXBlOidERUxFVEUnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ1gtQ1NSRi1Ub2tlbic6ICQoJ1tuYW1lPVwiX2NzcmZcIl0nKS52YWwoKVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihqc29uKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnZpZGVvLWdyb3VwJylbY3VycmVudEluZGV4XS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlY291bnRcbiAgICAgICAgJCgnLnZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbihpZHgsIGNoaWxkKXtcblxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQoY2hpbGQpLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5jaGlsZHJlbihcIltuYW1lXj0ndmlkZW9zJ11cIik7XG4gICAgICAgICAgICB0YXJnZXQuZWFjaChmdW5jdGlvbihpLGVsZSl7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJfbmFtZSA9ICQoZWxlKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICAgICAgdmFyIHdvcmRfc3Rhcl9hdCA9IGF0dHJfbmFtZS5pbmRleE9mKCdbJyk7XG4gICAgICAgICAgICAgICAgdmFyIHdvcmRfZW5kX2F0ID0gYXR0cl9uYW1lLmluZGV4T2YoJ10nKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3X2F0dHJfbmFtZSA9YXR0cl9uYW1lLnN1YnN0cigwLCB3b3JkX3N0YXJfYXQrMSkraWR4KyBhdHRyX25hbWUuc3Vic3RyKHdvcmRfZW5kX2F0KTtcblxuICAgICAgICAgICAgICAgICQoZWxlKS5hdHRyKCduYW1lJywgbmV3X2F0dHJfbmFtZSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHJlbW92ZV9idG4gPSAkKGNoaWxkKS5jaGlsZHJlbignLmNydWQtdmlkZW8tY29udHJvbCcpLmNoaWxkcmVuKCkuY2hpbGRyZW4oJyBidXR0b24nKTtcbiAgICAgICAgICAgIHJlbW92ZV9idG4uYXR0cignZGF0YS10YXJnZXQnLGlkeCk7XG5cbiAgICAgICAgfSk7XG4gICAgfTtcblxufTsiLCJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAkKCcjdGFncycpLnRhZ3NJbnB1dCh7XG4gICAgJ2hlaWdodCc6JzYwcHgnLFxuICAgICd3aWR0aCc6JzI4MHB4J1xuICB9KTtcblxuXG59KTtcbi8vIEBUT0RPIHdpbGwgY29uY2F0IGZpbGUgd2l0aCBndWxwIGluIHRoZSBmdXR1cmVcbi8vJC5nZXRTY3JpcHQoZG9tYWluLnNjcmlwdFBhdGgrXCJfZm9ybXMvX3ZpZGVvc0Zvcm0uanNcIiwgZnVuY3Rpb24oKXtcbi8vICAgIC8vcmVxdWlyZSgnLi9fZm9ybXMvX3ZpZGVvc0Zvcm0nKTtcbi8vfSk7XG5cbi8vcmVxdWlyZSBoYW5kbGViYXJzXG5cblxucmVxdWlyZSgnLi8uLi9saWIvaGVscGVycy9oYW5kbGViYXJzLWhlbHBlcnMnKTtcblxucmVxdWlyZSgnLi9fZm9ybXMvX3ZpZGVvc0Zvcm0uanMnKS52aWRlb0luaXQoKTtcblxuLy9yZXF1aXJlKCcuL3RlbXBsYXRlcy9xdWl6emVzRm9ybS5oYW5kbGViYXJzJyk7XG4vL015QXBwID0gd2luZG93WydNeUFwcCddIHx8e307XG4vL015QXBwLnRlbXBsYXRlcyA9IHdpbmRvd1snTXlBcHAnXS50ZW1wbGF0ZXMgfHwge307XG5cbnZhciBNeUFwcCA9IHdpbmRvd1snTXlBcHAnXSB8fHt9O1xuTXlBcHAgPSByZXF1aXJlKCcuL19mb3Jtcy9fcXVpenplc0Zvcm0uanMnKTtcblxuZnVuY3Rpb24gZmxhc2gobXNnKXtcblxufVxuXG5pZigkKCcjYnVpbGRTY29ybScpLmxlbmd0aCl7XG4gICAgcmVxdWlyZSgnLi9fZm9ybXMvX3Njcm9tRm9ybS5qcycpLmluaXQoKTtcbn1cbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBzZWxmPXRoaXMsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgb3B0aW9ucztcbiAgYnVmZmVyICs9IFwiXFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcInF1aXotZ3JvdXBcXFwiIGRhdGEtdGFyZ2V0PVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoaGVscGVyID0gaGVscGVycy5zZXRJbmRleCB8fCAoZGVwdGgwICYmIGRlcHRoMC5zZXRJbmRleCksb3B0aW9ucz17aGFzaDp7fSxkYXRhOmRhdGF9LGhlbHBlciA/IGhlbHBlci5jYWxsKGRlcHRoMCwgKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSwgb3B0aW9ucykgOiBoZWxwZXJNaXNzaW5nLmNhbGwoZGVwdGgwLCBcInNldEluZGV4XCIsIChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCksIG9wdGlvbnMpKSlcbiAgICArIFwiXFxcIj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJcXFwiPlxcbiAgICAgICAgICA8dWwgY2xhc3M9XFxcIm5hdiBuYXYtcGlsbHMgZ3JvdXAtbmF2XFxcIiBpZD1cXFwicXVpenplcy1ncm91cHMtbmF2XFxcIj5cXG4gICAgICAgICAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoKHN0YWNrMSA9IChkZXB0aDAgJiYgZGVwdGgwLnF1aXopKSxzdGFjazEgPT0gbnVsbCB8fCBzdGFjazEgPT09IGZhbHNlID8gc3RhY2sxIDogc3RhY2sxLnF1ZXN0aW9ucyksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbVdpdGhEZXB0aCgyLCBwcm9ncmFtMiwgZGF0YSwgZGVwdGgwKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcIiBwdWxsLXJpZ2h0XFxcIj5cXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVxcXCJhZGRcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjcXVpenplcy1ncm91cHMtbmF2XFxcIiBkYXRhLWFjdGlvbj1cXFwiYWRkXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBncm91cC1wYW5lLWFkZC1idG5cXFwiPkFkZCBRdWVzdGlvbjwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICA8L3VsPlxcbiAgICAgICAgICBcXG4gICAgICAgICAgXFxuICAgICAgICAgIFxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcInRhYi1jb250ZW50IGdyb3VwLXdyYXBwZXJcXFwiIGlkPVxcXCJxdWl6emVzLWdyb3VwLTBcXFwiPlxcbiAgICAgICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKChzdGFjazEgPSAoZGVwdGgwICYmIGRlcHRoMC5xdWl6KSksc3RhY2sxID09IG51bGwgfHwgc3RhY2sxID09PSBmYWxzZSA/IHN0YWNrMSA6IHN0YWNrMS5xdWVzdGlvbnMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW1XaXRoRGVwdGgoNSwgcHJvZ3JhbTUsIGRhdGEsIGRlcHRoMCksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgPC9kaXY+XFxuICBcIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuZnVuY3Rpb24gcHJvZ3JhbTIoZGVwdGgwLGRhdGEsZGVwdGgxKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXIsIG9wdGlvbnM7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgICAgICAgICA8bGkgIGNsYXNzPVxcXCJcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAuaXNBY3RpdmUpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW0oMywgcHJvZ3JhbTMsIGRhdGEpLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxcIiBpZD1cXFwiZ3JvdXAtbmF2LVwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XFxcInRhYlxcXCIgaHJlZj1cXFwiI2dyb3VwLXBhbmUtXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5vaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIi1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXFxcIiB0aXRsZT1cXFwiXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnF1ZXN0aW9uKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnF1ZXN0aW9uKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCI+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKGhlbHBlciA9IGhlbHBlcnMuc2V0SW5kZXggfHwgKGRlcHRoMCAmJiBkZXB0aDAuc2V0SW5kZXgpLG9wdGlvbnM9e2hhc2g6e30sZGF0YTpkYXRhfSxoZWxwZXIgPyBoZWxwZXIuY2FsbChkZXB0aDAsIChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCksIG9wdGlvbnMpIDogaGVscGVyTWlzc2luZy5jYWxsKGRlcHRoMCwgXCJzZXRJbmRleFwiLCAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09IGZhbHNlID8gZGF0YSA6IGRhdGEuaW5kZXgpLCBvcHRpb25zKSkpXG4gICAgKyBcIjwvYT5cXG4gICAgICAgICAgICAgICAgPC9saT5cXG4gICAgICAgICAgICBcIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuZnVuY3Rpb24gcHJvZ3JhbTMoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIFxuICByZXR1cm4gXCJhY3RpdmVcIjtcbiAgfVxuXG5mdW5jdGlvbiBwcm9ncmFtNShkZXB0aDAsZGF0YSxkZXB0aDEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlcjtcbiAgYnVmZmVyICs9IFwiXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFiLXBhbmUgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLmlzQWN0aXZlKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtKDMsIHByb2dyYW0zLCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIiBncm91cC1wYW5lXFxcIiBpZD1cXFwiZ3JvdXAtcGFuZS1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm9pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiLVwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwidGl0bGVcXFwiIGNsYXNzPVxcXCJjb2wtc20tMiBjb250cm9sLWxhYmVsXFxcIj5RdWVzdGlvbjo8L2xhYmVsPlxcblxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS0xIGNvbC1zbS1vZmZzZXQtOVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLXRhcmdldD1cXFwiI2dyb3VwLXBhbmUtXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5vaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIi1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXFxcIiBkYXRhLWFjdGlvbj1cXFwicmVtb3ZlXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJjbG9zZSBncm91cC1wYW5lLXJlbW92ZS1idG5cXFwiIHRpdGxlPVxcXCIgMXN0IHdvdWxkIG5vdCBiZSBkZWxldGVkIVxcXCI+w5c8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXNtLTExIGNvbC1zbS1vZmZzZXQtMVxcXCI+XFxuXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVxcXCIzXFxcIiBuYW1lPVxcXCJxdWl6emVzW1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJdW3F1ZXN0aW9uXVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJFbnRlciB0aGUgUXVlc3Rpb24gdGl0bGVcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5xdWVzdGlvbikgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5xdWVzdGlvbik7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RleHRhcmVhPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJvcHRpb25zLWdyb3VwIGNvbC1zbS1vZmZzZXQtMVxcXCIgaWQ9XFxcIm9wdGlvbnMtZ3JvdXAtcGFuZS1zdWItXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5vaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIi1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiLXdyYXBwZXJcXFwiPlxcblxcbiAgICAgICAgICAgICAgICAgICAgICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAuYW5zd2VycyksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbVdpdGhEZXB0aCg2LCBwcm9ncmFtNiwgZGF0YSwgZGVwdGgwKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcblxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwIGNydWQtb3B0aW9uLWNvbnRyb2xcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS0xMCBjb2wtc20tb2Zmc2V0LTJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGFyZ2V0PVxcXCIjZ3JvdXAtcGFuZS1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm9pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiLVwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCItMFxcXCIgIGRhdGEtYWN0aW9uPVxcXCJhZGRcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImJ0biBidG4taW5mbyBwdWxsLXJpZ2h0IGdyb3VwLXBhbmUtc3ViLWFkZC1idG5cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkIGFuIG9wdGlvblxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiY29ycmVjdFxcXCIgY2xhc3M9XFxcImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcXFwiPkNvcnJlY3Q8L2xhYmVsPlxcblxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS05XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIHJvd3M9XFxcIjJcXFwiIG5hbWU9XFxcInF1aXp6ZXNbXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09IGZhbHNlID8gZGF0YSA6IGRhdGEuaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIl1bY29ycmVjdF1cXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiSWYgQ29ycmVjdCA6IFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmNvcnJlY3QpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuY29ycmVjdCk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZXh0YXJlYT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiaW5jb3JyZWN0XFxcIiBjbGFzcz1cXFwiY29sLXNtLTMgY29udHJvbC1sYWJlbFxcXCI+SW5jb3JyZWN0PC9sYWJlbD5cXG5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tOVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVxcXCIyXFxcIiBuYW1lPVxcXCJxdWl6emVzW1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJdW2luY29ycmVjdF1cXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiSWYgaW5jb3JyZWN0IDogXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuaW5jb3JyZWN0KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmluY29ycmVjdCk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZXh0YXJlYT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5mdW5jdGlvbiBwcm9ncmFtNihkZXB0aDAsZGF0YSxkZXB0aDEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlcjtcbiAgYnVmZmVyICs9IFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJvcHRpb24tZ3JvdXAgZ3JvdXAtcGFuZS1zdWJcXFwiIGlkPVxcXCJncm91cC1wYW5lLXN1Yi1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm9pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiLVwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJvcHRpb25cXFwiIGNsYXNzPVxcXCJjb2wtc20tMiBjb250cm9sLWxhYmVsXFxcIj5PcHRpb24gOjwvbGFiZWw+XFxuXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS05XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJxdWl6emVzW1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMSAmJiBkZXB0aDEub2luZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJdW2Fuc3dlcnNdW1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJdW29wdGlvbl1cXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5vcHRpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAub3B0aW9uKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiRW50ZXIgb3B0aW9uIHRpdGxlXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS0xXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLXRhcmdldD1cXFwiI2dyb3VwLXBhbmUtc3ViLVwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMSAmJiBkZXB0aDEub2luZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCItXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09IGZhbHNlID8gZGF0YSA6IGRhdGEuaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIlxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1hY3Rpb249XFxcInJlbW92ZVxcXCIgY2xhc3M9XFxcImNsb3NlIGdyb3VwLXBhbmUtc3ViLXJlbW92ZS1idG5cXFwiPsOXPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tOSBjb2wtc20tb2Zmc2V0LTJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBuYW1lPVxcXCJxdWl6emVzW1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMSAmJiBkZXB0aDEub2luZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJdW2Fuc3dlcnNdW1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJdW2NvcnJlY3RdXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJDb3JyZWN0ID8gXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAmJiBkZXB0aDAuY29ycmVjdCksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbSg3LCBwcm9ncmFtNywgZGF0YSksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCIgPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiY29ycmVjdEJvb2xcXFwiIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIj5Db3JyZWN0ID88L2xhYmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cbmZ1bmN0aW9uIHByb2dyYW03KGRlcHRoMCxkYXRhKSB7XG4gIFxuICBcbiAgcmV0dXJuIFwiIGNoZWNrZWQgXCI7XG4gIH1cblxuICBidWZmZXIgKz0gXCI8ZGl2IGlkPVxcXCJxdWl6emVzLWdyb3Vwc1xcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcIiBhbGVydCBhbGVydC1pbmZvXFxcIiBpZD1cXFwicXVpek1zZ1xcXCIgc3R5bGU9XFxcImRpc3BsYXk6bm9uZTtcXFwiPlxcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtZGlzbWlzcz1cXFwiYWxlcnRcXFwiIGNsYXNzPVxcXCJjbG9zZVxcXCI+w5c8L2J1dHRvbj5cXG4gICAgICAgIDx1bD5cXG4gICAgICAgICAgICA8bGk+UXVpeiBBZGRlZCE8L2xpPlxcbiAgICAgICAgPC91bD5cXG4gICAgPC9kaXY+XFxuICBcIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoKHN0YWNrMSA9IChkZXB0aDAgJiYgZGVwdGgwLmZvcm0pKSxzdGFjazEgPT0gbnVsbCB8fCBzdGFjazEgPT09IGZhbHNlID8gc3RhY2sxIDogc3RhY2sxLnF1aXp6ZXMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW0oMSwgcHJvZ3JhbTEsIGRhdGEpLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cCBjcnVkLXF1aXotY29udHJvbFxcXCI+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS0xMFxcXCI+XFxuICAgICAgICA8aHIvPlxcblxcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKChzdGFjazEgPSAoZGVwdGgwICYmIGRlcHRoMC5mb3JtKSksc3RhY2sxID09IG51bGwgfHwgc3RhY2sxID09PSBmYWxzZSA/IHN0YWNrMSA6IHN0YWNrMS5hY3Rpb25OYW1lKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCI8L2J1dHRvbj5cXG4gICAgICAgICZuYnNwOzxhIGhyZWY9XFxcIi9hcnRpY2xlc1xcXCIgdGl0bGU9XFxcImNhbmNlbFxcXCIgY2xhc3M9XFxcImJ0blxcXCI+Q2FuY2VsPC9hPlxcblxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCJcbnZhciBxdWl6RXhhbXBsZSA9IGV4cG9ydHMucXVpeiA9IHtcbiAgICBcImluZm9cIjoge1xuICAgICAgICBcIm5hbWVcIjogICAgXCLlsI/mtYvor5UhIVwiLFxuICAgICAgICBcIm1haW5cIjogICAgXCI8cD7nnIvlrozop4bpopEg5bCP5rWL5LiA5LiLITwvcD5cIixcbiAgICAgICAgXCJyZXN1bHRzXCI6IFwiPGg1Pua1i+ivleWujOaIkDwvaDU+PHA+PC9wPlwiLFxuICAgICAgICBcImxldmVsMVwiOiAgXCLlrozlhajmjozmj6HnkIbop6Pov5DnlKjjgIJcIixcbiAgICAgICAgXCJsZXZlbDJcIjogIFwi5o6M5o+h5b6X5LiN6ZSZXCIsXG4gICAgICAgIFwibGV2ZWwzXCI6ICBcIuaBreWWnOaCqO+8jOWQiOagvOS6huOAglwiLFxuICAgICAgICBcImxldmVsNFwiOiAgXCLpurvpurvllabvvIzln7rmnKzmi4novablsL7jgIJcIixcbiAgICAgICAgXCJsZXZlbDVcIjogIFwi5LuN54S26ZyA6KaB5Yqq5Yqb5ZOmLi4uXCIgLy8gbm8gY29tbWEgaGVyZVxuICAgIH0sXG4gICAgXCJxdWVzdGlvbnNcIjogW1xuICAgICAgICB7IC8vIFF1ZXN0aW9uIDEgLSBNdWx0aXBsZSBDaG9pY2UsIFNpbmdsZSBUcnVlIEFuc3dlclxuICAgICAgICAgICAgXCJxdWVzdGlvblwiOiBcIueUt+aApzMzMDMwMzAzMCw1MOWygSzlhpzmsJEs5Lul6KGw5byx44CB5rCU5L+D44CB6L275bqm5bmy5ZKzOOS4quaciOWFpemZouOAguS9k+ajgDrlkbzlkLgyOOasoS/liIYs5Lik6IK65bqV6Ze754iG6KOC6Z+zKFZlbGNyb+e9l+mfsyks5pyJ5p2154q25oyHLOiDuOmDqFjnur865Lik6IK65Lit5LiL6YeO5byl5ryr5oCn572R54q25b2xLOiCuuWKn+iDveekuumZkOWItuaAp+mAmuawlOmanOeijSzmnIDlj6/og73nmoTor4rmlq3mmK9cIixcbiAgICAgICAgICAgIFwiYW5zd2Vyc1wiOiBbXG4gICAgICAgICAgICAgICAge1wib3B0aW9uXCI6IFwiQS7mhaLmgKfmlK/msJTnrqHngo5cIiwgICAgICBcImNvcnJlY3RcIjogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtcIm9wdGlvblwiOiBcIkIu54m55Y+R5oCn6IK66Ze06LSo57qk57u05YyWXCIsICAgICBcImNvcnJlY3RcIjogdHJ1ZX0sXG4gICAgICAgICAgICAgICAge1wib3B0aW9uXCI6IFwiQy7mlK/msJTnrqHmianlvKDnl4dcIiwgICAgICBcImNvcnJlY3RcIjogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtcIm9wdGlvblwiOiBcIkQu5b+D5Yqb6KGw56utXCIsICAgICBcImNvcnJlY3RcIjogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtcIm9wdGlvblwiOiBcIkUu55+96IK6XCIsICAgICBcImNvcnJlY3RcIjogZmFsc2V9IC8vIG5vIGNvbW1hIGhlcmVcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImNvcnJlY3RcIjogXCI8cD4g562U5qGI77yaQiA8c3Bhbj7mgqjnrZTlr7nkuobvvIE8L3NwYW4+IOimgeiusOS9j+iCuue6pOe7tOWMlu+8muiCuuWKn+iDveaPkOekuueahOaYr+mZkOWItuaAp+mAmuawlOmanOeijeOAguafpeS9k+mAmuW4uOacieadteeKtuaMh+OAgjwvcD5cIixcbiAgICAgICAgICAgIFwiaW5jb3JyZWN0XCI6IFwiPHA+562U5qGI77yaQiA8c3Bhbj7mirHmrYnvvIznrZTplJnkuobjgII8L3NwYW4+IOingeWIsOS4pOiCuuW6lemXu+eIhuijgumfsyhWZWxjcm/nvZfpn7Mp5oiW6KeB5Yiw6IO46YOoWOe6vzrkuKTogrrkuK3kuIvph47lvKXmvKvmgKfnvZHnirblvbHlsLHmmK/ogrrnuqTnu7TljJbvvJs8L3A+XCIgLy8gbm8gY29tbWEgaGVyZVxuICAgICAgICB9LFxuICAgICAgICB7IC8vIFF1ZXN0aW9uIDIgLSBNdWx0aXBsZSBDaG9pY2UsIE11bHRpcGxlIFRydWUgQW5zd2VycywgU2VsZWN0IEFueVxuICAgICAgICAgICAgXCJxdWVzdGlvblwiOiBcIuaUr+awlOeuoeWTruWWmOaCo+iAheaApeaAp+WPkeS9nDXlpKks5rWL5Yqo6ISJ6KGA5rCUcEg3LjQw44CBUGFP7oCRNi42N2tQYSg1MG1tSGcpLFBhQ0/ugJE4LjBrUGEoNjBtbUhnKeOAgUhDT+6Aku6AqjMwbW1vbC9M77yM5pyA5Y+v6IO96KGo5piOXCIsXG4gICAgICAgICAgICBcImFuc3dlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcIm9wdGlvblwiOiBcIkEu55eF5oOF5aW96L2sXCIsICAgICAgICAgICAgICAgXCJjb3JyZWN0XCI6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICB7XCJvcHRpb25cIjogXCJCLuayoeacieS4tOW6iuaEj+S5iVwiLCAgIFwiY29ycmVjdFwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgICB7XCJvcHRpb25cIjogXCJDLui9u+W6puWPkeS9nFwiLCAgICAgICAgICAgICAgIFwiY29ycmVjdFwiOiBmYWxzZX0sXG4gICAgICAgICAgICAgICAge1wib3B0aW9uXCI6IFwiRC7nl4Xmg4XkuKXph40s6aG756ev5p6B5rK755aXXCIsICAgICAgICAgICAgICAgXCJjb3JyZWN0XCI6IHRydWV9LFxuICAgICAgICAgICAgICAgIHtcIm9wdGlvblwiOiBcIkUu5pyJ5b+D6KGA566h5bm25Y+R55eHXCIsIFwiY29ycmVjdFwiOiBmYWxzZX0gLy8gbm8gY29tbWEgaGVyZVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwic2VsZWN0X2FueVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJjb3JyZWN0XCI6IFwiPHA+562U5qGI77yaRCA8c3Bhbj7mgqjnrZTlr7nkuobvvIEhPC9zcGFuPiA8c3Bhbj7liIbmnpDvvJo8L3NwYW4+PGJyIC8+IFxcXG4gICAgICAgICAgICAgICAgICAgICAgICDmlK/msJTnrqHlk67llpjlj5HkvZzml7bmmK/lkbzmsJTmgKflkbzlkLjlm7Dpmr7vvIzooYDmsJTliIbmnpDluLjluLjmmK/vvJrlkbzlkLjmgKfnorHkuK3mr5LjgIIgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIOmimOW5suWHuueOsOWTruWWmOWPkeS9nDXlpKnvvIzmj5DnpLrmmK/ph43nl4flk67llpjjgILvvIjlk67llpjmjIHnu63nirbmgIHlj6/mjIHnu60xLTLlpKnvvIzlj4jnp7DkuLrph43nl4flk67llpjvvJvmr4/liIbpkp/lkbzlkLgyOOasoS/liIbvvIxQ5aSn5LqOMTEw5qyhL+WIhuOAguWPr+WHuueOsOWRvOWQuOacuueWsuWKs++8jOWHuueOsOWlh+iEie+8jOihgOWOi+S4i+mZjeOAgeWkp+axl+a3i+a8k+OAgeS4pemHjeiEseawtOOAgeelnuW/l+aooeeziuOAguWHuueOsOWRvOWQuOaAp+mFuOS4reavku+8jOiLpee8uuawp+aYjuaYvuWPr+WQiOW5tuS7o+iwouaAp+mFuOS4reavku+8iVxcXG4gICAgICAgICAgICAgICAgICAgICAgICDpopjlubLmj5DnpLrvvJrlh7rnjrBQYUNP7oCR5r2055WZ77yM6K+05piO5piv6YeN55eH5ZOu5ZaY44CCXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIOe7vOS4iuaJgOi/sOaYr0Q8L3A+XCIsXG4gICAgICAgICAgICBcImluY29ycmVjdFwiOiBcIjxwPuetlOahiO+8mkIgRCA8c3Bhbj7mirHmrYnvvIznrZTplJnkuobjgIIuPC9zcGFuPiA8YnIgLz4gXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPuWIhuaekO+8mjwvc3Bhbj48YnIgLz4gXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIOaUr+awlOeuoeWTruWWmOWPkeS9nOaXtuaYr+WRvOawlOaAp+WRvOWQuOWbsOmavu+8jOihgOawlOWIhuaekOW4uOW4uOaYr++8muWRvOWQuOaAp+eiseS4reavkuOAgiBcXFxuICAgICAgICAgICAgICAgICAgICAgICAg6aKY5bmy5Ye6546w5ZOu5ZaY5Y+R5L2cNeWkqe+8jOaPkOekuuaYr+mHjeeXh+WTruWWmOOAgu+8iOWTruWWmOaMgee7reeKtuaAgeWPr+aMgee7rTEtMuWkqe+8jOWPiOensOS4uumHjeeXh+WTruWWmO+8m+avj+WIhumSn+WRvOWQuDI45qyhL+WIhu+8jFDlpKfkuo4xMTDmrKEv5YiG44CC5Y+v5Ye6546w5ZG85ZC45py655ay5Yqz77yM5Ye6546w5aWH6ISJ77yM6KGA5Y6L5LiL6ZmN44CB5aSn5rGX5reL5ryT44CB5Lil6YeN6ISx5rC044CB56We5b+X5qih57OK44CC5Ye6546w5ZG85ZC45oCn6YW45Lit5q+S77yM6Iul57y65rCn5piO5pi+5Y+v5ZCI5bm25Luj6LCi5oCn6YW45Lit5q+S77yJXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIOmimOW5suaPkOekuu+8muWHuueOsFBhQ0/ugJHmvbTnlZnvvIzor7TmmI7mmK/ph43nl4flk67llpjjgIJcXFxuICAgICAgICAgICAgICAgICAgICAgICAg57u85LiK5omA6L+w5pivQiBEIDwvcD5cIiAvLyBubyBjb21tYSBoZXJlXG4gICAgICAgIH0sXG4gICAgICAgIHsgLy8gUXVlc3Rpb24gMyAtIE11bHRpcGxlIENob2ljZSwgTXVsdGlwbGUgVHJ1ZSBBbnN3ZXJzLCBTZWxlY3QgQWxsXG4gICAgICAgICAgICBcInF1ZXN0aW9uXCI6IFwi5pSv5rCU566h5ZOu5ZaY5Y+R55eF55qE5pyA5Li76KaB55eF55CG5Z+656GA5pivLlwiLFxuICAgICAgICAgICAgXCJhbnN3ZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XCJvcHRpb25cIjogXCLmsJTpgZPnmoTpnZ7nibnlvILmgKfngo7nl4dcIiwgICAgICAgICAgIFwiY29ycmVjdFwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgICB7XCJvcHRpb25cIjogXCLlia/kuqTmhJ/npZ7nu4/lhbTlpYtcIiwgICAgICAgICAgICAgICAgICBcImNvcnJlY3RcIjogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtcIm9wdGlvblwiOiBcIue7huiPjOaEn+afk1wiLCAgXCJjb3JyZWN0XCI6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICB7XCJvcHRpb25cIjogXCLmlK/msJTnrqHnl4nmjJtcIiwgICAgICAgICAgXCJjb3JyZWN0XCI6IGZhbHNlfSAvLyBubyBjb21tYSBoZXJlXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJjb3JyZWN0XCI6IFwiPHA+IOetlOahiO+8mkEgPHNwYW4+5oKo562U5a+55LqG77yBITwvc3Bhbj4g5pSv5rCU566h5ZOu5ZaY55qE5a6a5LmJ5bey5ra155uW5LqG77yM5q276K6w44CCPC9wPlwiLFxuICAgICAgICAgICAgXCJpbmNvcnJlY3RcIjogXCI8cD7nrZTmoYjvvJpBIDxzcGFuPuaKseatie+8jOetlOmUmeS6huOAgi48L3NwYW4+IOaUr+awlOeuoeWTruWWmOeahOWumuS5ieW3sua2teebluS6hu+8jOatu+iusOOAgjwvcD5cIiAvLyBubyBjb21tYSBoZXJlXG4gICAgICAgIH0sXG4gICAgICAgIHsgLy8gUXVlc3Rpb24gNFxuICAgICAgICAgICAgXCJxdWVzdGlvblwiOiBcIueUt+aApzYw5bKB77yM56qB54S25aSc6Ze05Y+R5L2c5ZG85ZC45Zuw6Zq+77yM5p+l5L2T77ya5Y+M6IK65ruh5biD5ZG85rCU5oCn5ZOu6bij6Z+z44CC5LiL6Z2i5ZOq5Yeg6aG55a+56Ym05Yir6K+K5pat5pyJ5oSP5LmJ44CCXCIsXG4gICAgICAgICAgICBcImFuc3dlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcIm9wdGlvblwiOiBcIkEu6KGA5rCU5YiG5p6QXCIsICAgIFwiY29ycmVjdFwiOiBmYWxzZX0sXG4gICAgICAgICAgICAgICAge1wib3B0aW9uXCI6IFwiQi7otoXlo7Dlv4Pliqjlm75cIiwgICAgIFwiY29ycmVjdFwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgICB7XCJvcHRpb25cIjogXCJDLuiDuOmDqFjnur9cIiwgICAgICBcImNvcnJlY3RcIjogdHJ1ZX0sXG4gICAgICAgICAgICAgICAge1wib3B0aW9uXCI6IFwiRS7ml6LlvoDnl4Xlj7JcIiwgICBcImNvcnJlY3RcIjogdHJ1ZX0gLy8gbm8gY29tbWEgaGVyZVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiY29ycmVjdFwiOiBcIjxwPuetlOahiO+8mkE8c3Bhbj7mgqjnrZTlr7nkuobvvIEhPC9zcGFuPiA8L3A+XCIsXG4gICAgICAgICAgICBcImluY29ycmVjdFwiOiBcIjxwPuetlOahiO+8mkE8c3Bhbj7mirHmrYnvvIznrZTplJnkuobjgIIuPC9zcGFuPiA8L3A+XCIgLy8gbm8gY29tbWEgaGVyZVxuICAgICAgICB9XG4gICAgXVxufTtcbiIsIlxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdzZXRJbmRleCcsIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICB0aGlzLm9pbmRleCA9IHZhbHVlOyAgICAgLy8gQFRPRE8gc29tZSB0aW1lIC4uL2luZGV4IGNhbid0IHdvcms/XG4gICAgdGhpcy5oaW5kZXggPSBOdW1iZXIodmFsdWUgKyAxKTsgLy9JIG5lZWRlZCBodW1hbiByZWFkYWJsZSBpbmRleCwgbm90IHplcm8gYmFzZWRcbiAgICByZXR1cm4gdGhpcy5oaW5kZXg7XG59KTtcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbG9va3VwJywgZnVuY3Rpb24ob2JqLCBmaWVsZCl7XG4gICAgcmV0dXJuIG9ialtmaWVsZF07XG59KSIsIlwidXNlIHN0cmljdFwiO1xuLypnbG9iYWxzIEhhbmRsZWJhcnM6IHRydWUgKi9cbnZhciBiYXNlID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9iYXNlXCIpO1xuXG4vLyBFYWNoIG9mIHRoZXNlIGF1Z21lbnQgdGhlIEhhbmRsZWJhcnMgb2JqZWN0LiBObyBuZWVkIHRvIHNldHVwIGhlcmUuXG4vLyAoVGhpcyBpcyBkb25lIHRvIGVhc2lseSBzaGFyZSBjb2RlIGJldHdlZW4gY29tbW9uanMgYW5kIGJyb3dzZSBlbnZzKVxudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3V0aWxzXCIpO1xudmFyIHJ1bnRpbWUgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3J1bnRpbWVcIik7XG5cbi8vIEZvciBjb21wYXRpYmlsaXR5IGFuZCB1c2FnZSBvdXRzaWRlIG9mIG1vZHVsZSBzeXN0ZW1zLCBtYWtlIHRoZSBIYW5kbGViYXJzIG9iamVjdCBhIG5hbWVzcGFjZVxudmFyIGNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaGIgPSBuZXcgYmFzZS5IYW5kbGViYXJzRW52aXJvbm1lbnQoKTtcblxuICBVdGlscy5leHRlbmQoaGIsIGJhc2UpO1xuICBoYi5TYWZlU3RyaW5nID0gU2FmZVN0cmluZztcbiAgaGIuRXhjZXB0aW9uID0gRXhjZXB0aW9uO1xuICBoYi5VdGlscyA9IFV0aWxzO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn07XG5cbnZhciBIYW5kbGViYXJzID0gY3JlYXRlKCk7XG5IYW5kbGViYXJzLmNyZWF0ZSA9IGNyZWF0ZTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIYW5kbGViYXJzOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFZFUlNJT04gPSBcIjEuMy4wXCI7XG5leHBvcnRzLlZFUlNJT04gPSBWRVJTSU9OO3ZhciBDT01QSUxFUl9SRVZJU0lPTiA9IDQ7XG5leHBvcnRzLkNPTVBJTEVSX1JFVklTSU9OID0gQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc+PSAxLjAuMCdcbn07XG5leHBvcnRzLlJFVklTSU9OX0NIQU5HRVMgPSBSRVZJU0lPTl9DSEFOR0VTO1xudmFyIGlzQXJyYXkgPSBVdGlscy5pc0FycmF5LFxuICAgIGlzRnVuY3Rpb24gPSBVdGlscy5pc0Z1bmN0aW9uLFxuICAgIHRvU3RyaW5nID0gVXRpbHMudG9TdHJpbmcsXG4gICAgb2JqZWN0VHlwZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG5mdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMpIHtcbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcbiAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuXG4gIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG59XG5cbmV4cG9ydHMuSGFuZGxlYmFyc0Vudmlyb25tZW50ID0gSGFuZGxlYmFyc0Vudmlyb25tZW50O0hhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cbiAgbG9nZ2VyOiBsb2dnZXIsXG4gIGxvZzogbG9nLFxuXG4gIHJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lLCBmbiwgaW52ZXJzZSkge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoaW52ZXJzZSB8fCBmbikgeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTsgfVxuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbnZlcnNlKSB7IGZuLm5vdCA9IGludmVyc2U7IH1cbiAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcblxuICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUsIHN0cikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5wYXJ0aWFscywgIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gc3RyO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGFyZykge1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJNaXNzaW5nIGhlbHBlcjogJ1wiICsgYXJnICsgXCInXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSB8fCBmdW5jdGlvbigpIHt9LCBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZihjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBpZihjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZm4oY29udGV4dCk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgZm4gPSBvcHRpb25zLmZuLCBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlO1xuICAgIHZhciBpID0gMCwgcmV0ID0gXCJcIiwgZGF0YTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGlmKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IodmFyIGogPSBjb250ZXh0Lmxlbmd0aDsgaTxqOyBpKyspIHtcbiAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgZGF0YS5sYXN0ICA9IChpID09PSAoY29udGV4dC5sZW5ndGgtMSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2ldLCB7IGRhdGE6IGRhdGEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcih2YXIga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGlmKGRhdGEpIHsgXG4gICAgICAgICAgICAgIGRhdGEua2V5ID0ga2V5OyBcbiAgICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2tleV0sIHtkYXRhOiBkYXRhfSk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaSA9PT0gMCl7XG4gICAgICByZXQgPSBpbnZlcnNlKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uYWwpKSB7IGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTsgfVxuXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciBpcyB0byByZW5kZXIgdGhlIHBvc2l0aXZlIHBhdGggaWYgdGhlIHZhbHVlIGlzIHRydXRoeSBhbmQgbm90IGVtcHR5LlxuICAgIC8vIFRoZSBgaW5jbHVkZVplcm9gIG9wdGlvbiBtYXkgYmUgc2V0IHRvIHRyZWF0IHRoZSBjb25kdGlvbmFsIGFzIHB1cmVseSBub3QgZW1wdHkgYmFzZWQgb24gdGhlXG4gICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cbiAgICBpZiAoKCFvcHRpb25zLmhhc2guaW5jbHVkZVplcm8gJiYgIWNvbmRpdGlvbmFsKSB8fCBVdGlscy5pc0VtcHR5KGNvbmRpdGlvbmFsKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcyk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7Zm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbiwgaGFzaDogb3B0aW9ucy5oYXNofSk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd3aXRoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmICghVXRpbHMuaXNFbXB0eShjb250ZXh0KSkgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb2cnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGxldmVsID0gb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YS5sZXZlbCAhPSBudWxsID8gcGFyc2VJbnQob3B0aW9ucy5kYXRhLmxldmVsLCAxMCkgOiAxO1xuICAgIGluc3RhbmNlLmxvZyhsZXZlbCwgY29udGV4dCk7XG4gIH0pO1xufVxuXG52YXIgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IHsgMDogJ2RlYnVnJywgMTogJ2luZm8nLCAyOiAnd2FybicsIDM6ICdlcnJvcicgfSxcblxuICAvLyBTdGF0ZSBlbnVtXG4gIERFQlVHOiAwLFxuICBJTkZPOiAxLFxuICBXQVJOOiAyLFxuICBFUlJPUjogMyxcbiAgbGV2ZWw6IDMsXG5cbiAgLy8gY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgb2JqKSB7XG4gICAgaWYgKGxvZ2dlci5sZXZlbCA8PSBsZXZlbCkge1xuICAgICAgdmFyIG1ldGhvZCA9IGxvZ2dlci5tZXRob2RNYXBbbGV2ZWxdO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlW21ldGhvZF0pIHtcbiAgICAgICAgY29uc29sZVttZXRob2RdLmNhbGwoY29uc29sZSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5leHBvcnRzLmxvZ2dlciA9IGxvZ2dlcjtcbmZ1bmN0aW9uIGxvZyhsZXZlbCwgb2JqKSB7IGxvZ2dlci5sb2cobGV2ZWwsIG9iaik7IH1cblxuZXhwb3J0cy5sb2cgPSBsb2c7dmFyIGNyZWF0ZUZyYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBvYmogPSB7fTtcbiAgVXRpbHMuZXh0ZW5kKG9iaiwgb2JqZWN0KTtcbiAgcmV0dXJuIG9iajtcbn07XG5leHBvcnRzLmNyZWF0ZUZyYW1lID0gY3JlYXRlRnJhbWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlcnJvclByb3BzID0gWydkZXNjcmlwdGlvbicsICdmaWxlTmFtZScsICdsaW5lTnVtYmVyJywgJ21lc3NhZ2UnLCAnbmFtZScsICdudW1iZXInLCAnc3RhY2snXTtcblxuZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcbiAgdmFyIGxpbmU7XG4gIGlmIChub2RlICYmIG5vZGUuZmlyc3RMaW5lKSB7XG4gICAgbGluZSA9IG5vZGUuZmlyc3RMaW5lO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG5cbiAgdmFyIHRtcCA9IEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIC8vIFVuZm9ydHVuYXRlbHkgZXJyb3JzIGFyZSBub3QgZW51bWVyYWJsZSBpbiBDaHJvbWUgKGF0IGxlYXN0KSwgc28gYGZvciBwcm9wIGluIHRtcGAgZG9lc24ndCB3b3JrLlxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzW2Vycm9yUHJvcHNbaWR4XV0gPSB0bXBbZXJyb3JQcm9wc1tpZHhdXTtcbiAgfVxuXG4gIGlmIChsaW5lKSB7XG4gICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcbiAgICB0aGlzLmNvbHVtbiA9IG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cbn1cblxuRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV4Y2VwdGlvbjsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgQ09NUElMRVJfUkVWSVNJT04gPSByZXF1aXJlKFwiLi9iYXNlXCIpLkNPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSByZXF1aXJlKFwiLi9iYXNlXCIpLlJFVklTSU9OX0NIQU5HRVM7XG5cbmZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG4gIHZhciBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgY3VycmVudFJldmlzaW9uID0gQ09NUElMRVJfUkVWSVNJT047XG5cbiAgaWYgKGNvbXBpbGVyUmV2aXNpb24gIT09IGN1cnJlbnRSZXZpc2lvbikge1xuICAgIGlmIChjb21waWxlclJldmlzaW9uIDwgY3VycmVudFJldmlzaW9uKSB7XG4gICAgICB2YXIgcnVudGltZVZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGFuIG9sZGVyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitydW50aW1lVmVyc2lvbnMrXCIpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJWZXJzaW9ucytcIikuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcnVudGltZSB0byBhIG5ld2VyIHZlcnNpb24gKFwiK2NvbXBpbGVySW5mb1sxXStcIikuXCIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmNoZWNrUmV2aXNpb24gPSBjaGVja1JldmlzaW9uOy8vIFRPRE86IFJlbW92ZSB0aGlzIGxpbmUgYW5kIGJyZWFrIHVwIGNvbXBpbGVQYXJ0aWFsXG5cbmZ1bmN0aW9uIHRlbXBsYXRlKHRlbXBsYXRlU3BlYywgZW52KSB7XG4gIGlmICghZW52KSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk5vIGVudmlyb25tZW50IHBhc3NlZCB0byB0ZW1wbGF0ZVwiKTtcbiAgfVxuXG4gIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG4gIC8vIGZvciBleHRlcm5hbCB1c2VycyB0byBvdmVycmlkZSB0aGVzZSBhcyBwc3VlZG8tc3VwcG9ydGVkIEFQSXMuXG4gIHZhciBpbnZva2VQYXJ0aWFsV3JhcHBlciA9IGZ1bmN0aW9uKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gICAgdmFyIHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7IHJldHVybiByZXN1bHQ7IH1cblxuICAgIGlmIChlbnYuY29tcGlsZSkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7IGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuICAgICAgcGFydGlhbHNbbmFtZV0gPSBlbnYuY29tcGlsZShwYXJ0aWFsLCB7IGRhdGE6IGRhdGEgIT09IHVuZGVmaW5lZCB9LCBlbnYpO1xuICAgICAgcmV0dXJuIHBhcnRpYWxzW25hbWVdKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZVwiKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSnVzdCBhZGQgd2F0ZXJcbiAgdmFyIGNvbnRhaW5lciA9IHtcbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBmbiwgZGF0YSkge1xuICAgICAgdmFyIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXTtcbiAgICAgIGlmKGRhdGEpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSBwcm9ncmFtKGksIGZuLCBkYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoIXByb2dyYW1XcmFwcGVyKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSA9IHByb2dyYW0oaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG4gICAgbWVyZ2U6IGZ1bmN0aW9uKHBhcmFtLCBjb21tb24pIHtcbiAgICAgIHZhciByZXQgPSBwYXJhbSB8fCBjb21tb247XG5cbiAgICAgIGlmIChwYXJhbSAmJiBjb21tb24gJiYgKHBhcmFtICE9PSBjb21tb24pKSB7XG4gICAgICAgIHJldCA9IHt9O1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBjb21tb24pO1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBwYXJhbSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gICAgcHJvZ3JhbVdpdGhEZXB0aDogZW52LlZNLnByb2dyYW1XaXRoRGVwdGgsXG4gICAgbm9vcDogZW52LlZNLm5vb3AsXG4gICAgY29tcGlsZXJJbmZvOiBudWxsXG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgbmFtZXNwYWNlID0gb3B0aW9ucy5wYXJ0aWFsID8gb3B0aW9ucyA6IGVudixcbiAgICAgICAgaGVscGVycyxcbiAgICAgICAgcGFydGlhbHM7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcbiAgICAgIHBhcnRpYWxzID0gb3B0aW9ucy5wYXJ0aWFscztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IHRlbXBsYXRlU3BlYy5jYWxsKFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBuYW1lc3BhY2UsIGNvbnRleHQsXG4gICAgICAgICAgaGVscGVycyxcbiAgICAgICAgICBwYXJ0aWFscyxcbiAgICAgICAgICBvcHRpb25zLmRhdGEpO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGVudi5WTS5jaGVja1JldmlzaW9uKGNvbnRhaW5lci5jb21waWxlckluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmV4cG9ydHMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtmdW5jdGlvbiBwcm9ncmFtV2l0aERlcHRoKGksIGZuLCBkYXRhIC8qLCAkZGVwdGggKi8pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuXG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIFtjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YV0uY29uY2F0KGFyZ3MpKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IGFyZ3MubGVuZ3RoO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtV2l0aERlcHRoID0gcHJvZ3JhbVdpdGhEZXB0aDtmdW5jdGlvbiBwcm9ncmFtKGksIGZuLCBkYXRhKSB7XG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IDA7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW0gPSBwcm9ncmFtO2Z1bmN0aW9uIGludm9rZVBhcnRpYWwocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgdmFyIG9wdGlvbnMgPSB7IHBhcnRpYWw6IHRydWUsIGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuXG4gIGlmKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgZm91bmRcIik7XG4gIH0gZWxzZSBpZihwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gcGFydGlhbChjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnRzLmludm9rZVBhcnRpYWwgPSBpbnZva2VQYXJ0aWFsO2Z1bmN0aW9uIG5vb3AoKSB7IHJldHVybiBcIlwiOyB9XG5cbmV4cG9ydHMubm9vcCA9IG5vb3A7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBcIlwiICsgdGhpcy5zdHJpbmc7XG59O1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFNhZmVTdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmpzaGludCAtVzAwNCAqL1xudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBlc2NhcGUgPSB7XG4gIFwiJlwiOiBcIiZhbXA7XCIsXG4gIFwiPFwiOiBcIiZsdDtcIixcbiAgXCI+XCI6IFwiJmd0O1wiLFxuICAnXCInOiBcIiZxdW90O1wiLFxuICBcIidcIjogXCImI3gyNztcIixcbiAgXCJgXCI6IFwiJiN4NjA7XCJcbn07XG5cbnZhciBiYWRDaGFycyA9IC9bJjw+XCInYF0vZztcbnZhciBwb3NzaWJsZSA9IC9bJjw+XCInYF0vO1xuXG5mdW5jdGlvbiBlc2NhcGVDaGFyKGNocikge1xuICByZXR1cm4gZXNjYXBlW2Nocl0gfHwgXCImYW1wO1wiO1xufVxuXG5mdW5jdGlvbiBleHRlbmQob2JqLCB2YWx1ZSkge1xuICBmb3IodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkge1xuICAgICAgb2JqW2tleV0gPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDt2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuaWYgKGlzRnVuY3Rpb24oL3gvKSkge1xuICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICB9O1xufVxudmFyIGlzRnVuY3Rpb247XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgPyB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyA6IGZhbHNlO1xufTtcbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGVzY2FwZUV4cHJlc3Npb24oc3RyaW5nKSB7XG4gIC8vIGRvbid0IGVzY2FwZSBTYWZlU3RyaW5ncywgc2luY2UgdGhleSdyZSBhbHJlYWR5IHNhZmVcbiAgaWYgKHN0cmluZyBpbnN0YW5jZW9mIFNhZmVTdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAoIXN0cmluZyAmJiBzdHJpbmcgIT09IDApIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuICAvLyB0aGUgcmVnZXggdGVzdCB3aWxsIGRvIHRoaXMgdHJhbnNwYXJlbnRseSBiZWhpbmQgdGhlIHNjZW5lcywgY2F1c2luZyBpc3N1ZXMgaWZcbiAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gIHN0cmluZyA9IFwiXCIgKyBzdHJpbmc7XG5cbiAgaWYoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydHMuZXNjYXBlRXhwcmVzc2lvbiA9IGVzY2FwZUV4cHJlc3Npb247ZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7IiwiLy8gQ3JlYXRlIGEgc2ltcGxlIHBhdGggYWxpYXMgdG8gYWxsb3cgYnJvd3NlcmlmeSB0byByZXNvbHZlXG4vLyB0aGUgcnVudGltZSBvbiBhIHN1cHBvcnRlZCBwYXRoLlxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZScpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaGFuZGxlYmFycy9ydW50aW1lXCIpW1wiZGVmYXVsdFwiXTtcbiJdfQ==
