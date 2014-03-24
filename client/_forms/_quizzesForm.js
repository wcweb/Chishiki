
    var config={
        data: {},
        wrapper:'body'
        },
        template ={
            "textarea":'&lt;textarea id="desc" rows="5" name="body" placeholder="Enter the article description" ' +
                'class="form-control"> ' +
                'Donec lacinia congue felis in faucibus.&lt;/textarea &gt;',
            "checkbox":'<input type="checkbox" name="quizees[0]answers[0]correct" placeholder="Correct ? " checked="">'
        };
//    console.log(handlebars);
        //console.log(handlebars);
//    Handlebars = handlebars['default'];





    exports.formBuild =function (options){
        //@TODO use extend fn.
        config.data = options.data;
        config.wrapper = options.wrapper;
        var data = config.data;
        var wrapper =$( config.wrapper);
        //wrapper.html(MyApp.templates["index"](data));


        var template = require('./../templates/quizzesForm.handlebars');
        var html = template({title: "An instantiated template!", name: "David"});
        wrapper.html(html);
//        var formTemplate = Handlebars.compile($('#form-template').html());
//        wrapper.html(formTemplate(data));
//        wrapper.html(Handlebars.templates.index(data));
        console.log(wrapper);
        // each property in data
        // add new tab , add form, add submit button ,add elem button
        // each property in element , isArray
        // add panel element (eq. remove cur elem button)
        // each property in elem  isArray
        // add textArea , checkBox , or radiosGroup
        //

        buildReduce(data);


    };

    var buildReduce = function (data){
            for(var prop in data){
                var element = data[prop];
                if(isArray(element)){
                   //buildReduce(element);

                }
            }
        },
        addPanel = function(){
            // case index == 0 : tab panel
            // case index == 1 : groups
            // case index >=1 : group

            // create template with data.property
            // template append

            // combing target with action
            // events bind with button.


        },
        isArray = function(obj){
            return Object.prototype.toString.apply(obj) === '[object Array]';
        };
