import Model from './model.js';

export default class View {
    constructor(){
        this.pageContainers = ['no-question-container', 'tags-container', 'question-details-container',
                        'questions-container', 'add-question-container', 'add-answer-container'];
        this.model = new Model();
        this.questions = [];
        this.searching = false;
    }

    init(){
        this.clearDisplay('questions-container');
        this.questions = this.model.getAllQstns();
        this.setActiveLink('questions');
        document.getElementById('questions-nav').addEventListener('click', ()=>{
            this.searching = false;
            this.questions = this.model.getAllQstns();
            this.clearDisplay('questions-container');
            this.setActiveLink('questions');
            this.displayQuestions();
        });
        document.getElementById('tags-nav').addEventListener('click', ()=>{
            this.searching = false;
            this.questions = this.model.getAllQstns();
            this.clearDisplay('tags-container');
            this.setActiveLink('tags');
            this.displayTags();
        });

        // Add event listener on keyup
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('keyup', (event) => {
            if(event.code === 'Enter'){
                this.searching = true;
                const value = document.getElementById('search-input').value;
                this.questions = this.model.queryQuestions(value);
                this.clearDisplay('questions-container');
                this.setActiveLink('questions');
                this.displayQuestions();
            }
            // Alert the key name and key code on keydown
        }, false);

        this.displayQuestions();
    }

    displayByDateDesc(){
        this.questions = this.model.getQuestionByDateDesc();
        this.clearDisplay('questions-container');
        this.displayQuestions();
    }

    displayUnanswered(){
        this.questions = this.model.getUnansweredQuestions();
        this.clearDisplay('questions-container');
        this.displayQuestions();
    }
    
    displayByActivity(){
        this.questions = this.model.getQuestionsByActivity();
        this.clearDisplay('questions-container');
        this.displayQuestions();
    }

    displayQtnDetails(questionId){
        this.setActiveLink('clear');
        this.model.increamentViews(questionId);
        const question = this.model.getQstnById(questionId);
        const mainDiv = document.getElementById('question-details-container');
        mainDiv.innerHTML = '';

        const answers = this.model.getQuestionAnswers(question.qid);

        const titleDiv = document.createElement('div');
        titleDiv.classList.add('question-detail');
        const t1 = document.createElement('h3');
        t1.innerText = `${answers.length} ${answers.length > 1 ? 'answers' : 'answer'}`;
        titleDiv.appendChild(t1);
        const t2 = document.createElement('h3');
        t2.classList.add('question-detail-title');
        
        t2.innerText = `${question.title}`;
        titleDiv.appendChild(t2);
        const askBtn = document.createElement('button');
        askBtn.classList.add('ask-btn');
        askBtn.style.marginLeft = '100px';
        askBtn.innerText = 'Ask Questions';
        askBtn.addEventListener('click', () => {
            this.clearDisplay('add-question-container');
            this.displayAskQuestion();
        });
        titleDiv.appendChild(askBtn);
        mainDiv.appendChild(titleDiv);

        const detailDiv = document.createElement('div');
        detailDiv.classList.add('question');
        const tv = document.createElement('h3');
        tv.classList.add('side-details');
        tv.innerText = `${question.views} ${question.views > 1 ? 'views' : 'view'}`;
        detailDiv.appendChild(tv);
        const pd = document.createElement('p');
        pd.classList.add('question-detail-desc');
        pd.innerText = `${question.text}`;
        detailDiv.appendChild(pd);

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('timestamp-details');
        const p1 = document.createElement('p');
        p1.classList.add('author');
        p1.innerText = `${question.askedBy}`;
        timeDiv.appendChild(p1);
        const p2 = document.createElement('p');
        p2.innerText = `asked ${this.formatTime(question.askDate)}`;
        timeDiv.appendChild(p2);
        detailDiv.appendChild(timeDiv);
        mainDiv.appendChild(detailDiv);
        const br = document.createElement('br');
       mainDiv.appendChild(br);

       if(answers.length > 0){

           const scrollDiv = document.createElement('div');
           scrollDiv.classList.add('answers-scroll');
           
            for (let i = 0; i < answers.length; i++) {
                const answerDiv = document.createElement('div');
                answerDiv.classList.add('answer-item');
                const tv = document.createElement('p');
                tv.classList.add('question-answer');
                tv.innerText = answers[i].text;
                answerDiv.appendChild(tv);
    
                const div = document.createElement('div');
                div.classList.add('timestamp-details');
                const pd1 = document.createElement('p');
                pd1.style.color ="green";
                pd1.innerText = answers[i].ansBy;
                const pd2 = document.createElement('p');
                pd2.innerText = `answered ${this.formatTime(answers[i].ansDate)}`
                div.appendChild(pd1);
                div.appendChild(pd2);
                answerDiv.appendChild(div);
                scrollDiv.appendChild(answerDiv);
            }  
            
            mainDiv.appendChild(scrollDiv);
            const br2 = document.createElement('br');
            mainDiv.appendChild(br2);
       }
        const postBtn = document.createElement('button');
        postBtn.classList.add('ask-btn');
        postBtn.innerText = 'Answer Question';
        postBtn.addEventListener('click', () => {
            this.clearDisplay('add-answer-container');
            this.displayPostAnswer(questionId);
        });
        mainDiv.appendChild(postBtn);
    }


    displayTags(){
        const tagsDiv = document.getElementById('tags-container');
        tagsDiv.innerHTML = '';
        
        const tags = this.model.getAllTags();

        const titleDiv = document.createElement('div');
        titleDiv.classList.add('tags-title');
        const t1 = document.createElement('h2');
        t1.innerText = `${tags.length} Tags`;
        const t2 = document.createElement('h2');
        t2.innerText = 'All Tags';
        titleDiv.appendChild(t1);
        titleDiv.appendChild(t2);

        const askBtn = document.createElement('button');
        askBtn.classList.add('ask-btn');
        askBtn.innerText = 'Ask Questions';
        askBtn.addEventListener('click', () => {
            this.clearDisplay('add-question-container');
            this.displayAskQuestion();
        });
        titleDiv.appendChild(askBtn);
        tagsDiv.appendChild(titleDiv);

        const tagsList = document.createElement('div');
        tagsList.classList.add('tags-list');
        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            const tagItem = document.createElement('div');
            tagItem.classList.add('tag');

            const tagL = document.createElement('a');
            tagL.classList.add('tag-link');
            tagL.innerHTML = tag.name;
            tagL.addEventListener('click', () => {
                this.questions = this.model.getQuestionsByTag(tag.tid);
                this.setActiveLink('questions');
                this.clearDisplay('questions-container');
                this.displayQuestions();
            });
            tagItem.appendChild(tagL)
            const tagC = document.createElement('p');
            tagC.classList.add('tag-question-num');
            tagC.innerHTML = `${tag.qCount} ${tag.qCount > 1 ? 'questions' : 'question'}`;
            tagItem.appendChild(tagC)
            tagsList.appendChild(tagItem);           
        }
        tagsDiv.appendChild(tagsList);
    }

    displayAskQuestion(){
        this.setActiveLink('clear');
        const askDiv = document.getElementById('add-question-container');
        askDiv.innerHTML = '';
        const form = document.createElement('form');
        form.classList.add('form-group');

        const titleFG1 = document.createElement('div');
        titleFG1.classList.add('field-group');
        const lb1 = document.createElement('label');
        lb1.innerText = 'Question Title*';
        const em1 = document.createElement('em');
        em1.innerText = 'Limit title to 100 characters or less';
        const inp1 = document.createElement('input');
        inp1.classList.add('input-field');
        inp1.setAttribute('required', '');
        inp1.setAttribute('name', 'title');
        titleFG1.appendChild(lb1);
        titleFG1.appendChild(em1);
        titleFG1.appendChild(inp1);
        form.appendChild(titleFG1);

        const titleFG2 = document.createElement('div');
        titleFG2.classList.add('field-group');
        const lb2 = document.createElement('label');
        lb2.innerText = 'Question Text*';
        const em2 = document.createElement('em');
        em2.innerText = 'Add details';
        const inp2 = document.createElement('textarea');
        inp2.classList.add('text-field');
        inp2.setAttribute('required', '');
        inp2.setAttribute('name', 'text');
        inp2.setAttribute('rows', '5');
        titleFG2.appendChild(lb2);
        titleFG2.appendChild(em2);
        titleFG2.appendChild(inp2);
        form.appendChild(titleFG2);

        const titleFG3 = document.createElement('div');
        titleFG3.classList.add('field-group');
        const lb3 = document.createElement('label');
        lb3.innerText = 'Tags*';
        const em3 = document.createElement('em');
        em3.innerText = 'Add keywords seperated by whitespace';
        const inp3 = document.createElement('input');
        inp3.classList.add('input-field');
        inp3.setAttribute('required', '');
        inp3.setAttribute('name', 'tags');
        titleFG3.appendChild(lb3);
        titleFG3.appendChild(em3);
        titleFG3.appendChild(inp3);
        form.appendChild(titleFG3);

        const titleFG4 = document.createElement('div');
        titleFG4.classList.add('field-group');
        const lb4 = document.createElement('label');
        lb4.innerText = 'Username*';
        const inp4 = document.createElement('input');
        inp4.classList.add('input-field');
        inp4.setAttribute('required', '');
        inp4.setAttribute('name', 'username');
        titleFG4.appendChild(lb4);
        titleFG4.appendChild(inp4);
        form.appendChild(titleFG4);

        const titleFG5 = document.createElement('div');
        titleFG5.classList.add('form-action');
        const btn1 = document.createElement('button');
        btn1.classList.add('post-btn');
        btn1.innerText = 'Post Question';        
        const span = document.createElement('span');
        span.style.color = 'darkred';
        span.innerText = '* indicates mandatory fields';
        titleFG5.appendChild(btn1);
        titleFG5.appendChild(span);
        form.appendChild(titleFG5);
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const question = {
                title: document.getElementsByName('title')[0].value,
                text: document.getElementsByName('text')[0].value,
                tags: document.getElementsByName('tags')[0].value,
                username: document.getElementsByName('username')[0].value
            };
            
            this.model.insertQstn(question);
            this.clearDisplay('questions-container');
            this.questions = this.model.getAllQstns();
            this.displayQuestions();
        });
        askDiv.appendChild(form);        
    }

    displayPostAnswer(questionId){
        this.setActiveLink('clear');
        const answrDiv = document.getElementById('add-question-container');
        answrDiv.innerHTML = '';

        const form = document.createElement('form');
        form.classList.add('form-group');

        const titleFG4 = document.createElement('div');
        titleFG4.classList.add('field-group');
        const lb4 = document.createElement('label');
        lb4.innerText = 'Username*';
        const inp4 = document.createElement('input');
        inp4.classList.add('input-field');
        inp4.setAttribute('required', '');
        inp4.setAttribute('name', 'username');
        titleFG4.appendChild(lb4);
        titleFG4.appendChild(inp4);
        form.appendChild(titleFG4);

        const titleFG2 = document.createElement('div');
        titleFG2.classList.add('field-group');
        const lb2 = document.createElement('label');
        lb2.innerText = 'Answer Text*';
        const inp2 = document.createElement('textarea');
        inp2.classList.add('text-field');
        inp2.setAttribute('required', '');
        inp2.setAttribute('name', 'text');
        inp2.setAttribute('rows', '6');
        inp2.setAttribute('cols', '5');
        titleFG2.appendChild(lb2);
        titleFG2.appendChild(inp2);
        form.appendChild(titleFG2);

        const titleFG5 = document.createElement('div');
        titleFG5.classList.add('form-action');
        const btn1 = document.createElement('button');
        btn1.classList.add('post-btn');
        btn1.innerText = 'Post Answer';        
        const span = document.createElement('span');
        span.style.color = 'darkred';
        span.innerText = '* indicates mandatory fields';
        titleFG5.appendChild(btn1);
        titleFG5.appendChild(span);
        form.appendChild(titleFG5);
        form.addEventListener("submit", () => {
            const answer = {
                text: document.getElementsByName('text')[0].value,
                username: document.getElementsByName('username')[0].value
            };
            this.model.insertAnswr(answer, questionId);
            this.clearDisplay('question-details-container');
            this.displayQtnDetails(questionId);
        });
        answrDiv.appendChild(form); 
    }
    

    displayNoQuestions(){
        const noQDiv = document.getElementById('no-question-container');
        noQDiv.innerHTML = '';
        this.createMainTitleDiv(noQDiv);
        this.createInnerMainTitleDiv(noQDiv);
        const p = document.createElement('h3');
        p.classList.add('no-question-cont');
        p.innerText = 'No Questions found';
        noQDiv.appendChild(p);              
    }


    displayQuestions(){
        
        const questionsDiv = document.getElementById('questions-container');
        questionsDiv.innerHTML = '';

        if(this.questions.length === 0){
            this.displayNoQuestions();
            return;
        }
        
        this.createMainTitleDiv(questionsDiv);
        this.createInnerMainTitleDiv(questionsDiv);
        // questions
        for (let i = 0; i < this.questions.length; i++) {
            const question = this.questions[i];
            const qtnDiv = document.createElement('div');
            qtnDiv.classList.add('question');

            const viewDiv = document.createElement('div');
            viewDiv.classList.add('views');

            const aSpan = document.createElement('span');
            aSpan.classList.add('views-item');
            aSpan.innerText = `${question.ansIds.length} ${question.ansIds.length > 1 ? 'answers' : 'answer'}`;
            
            const vSpan = document.createElement('span');
            vSpan.classList.add('views-item');
            vSpan.innerText = `${question.views} ${question.views > 1 ? 'views' : 'view'}`;
            viewDiv.appendChild(aSpan);
            viewDiv.appendChild(vSpan);
            qtnDiv.appendChild(viewDiv);

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('question-title');
            const qLink = document.createElement('a');
            qLink.classList.add('question-title-link');
            qLink.innerText = question.title;
            qLink.addEventListener('click', ()=>{
                this.clearDisplay('question-details-container');
                this.displayQtnDetails(question.qid);
            });
            titleDiv.appendChild(qLink);

            const tGrps = document.createElement('div');
            tGrps.classList.add('btn-group-tags');

            const tags = this.model.getQuestionTags(question.qid);
            for (let j = 0; j < tags.length; j++) {
                const tbtn = document.createElement('button');
                tbtn.classList.add('btn-tag');
                tbtn.innerText = tags[j].name;
                tGrps.appendChild(tbtn);
            }
          
            titleDiv.appendChild(tGrps);

            qtnDiv.appendChild(titleDiv);

            const p = document.createElement('p');
            p.classList.add('timestamp');

            const spn1 = document.createElement('span');
            spn1.classList.add('quest-author');
            spn1.innerText = question.askedBy;
            const spn2 = document.createElement('span');
            spn2.innerText = `asked ${this.formatTime(question.askDate)}`;
            p.appendChild(spn1);
            p.appendChild(spn2);

            qtnDiv.appendChild(p);
            questionsDiv.appendChild(qtnDiv);
           
        }
    }

    createInnerMainTitleDiv(parentDiv){
        //create questions container filter buttons
        const innerDiv = document.createElement('div');
        innerDiv.classList.add('inner-main-title-container');
        if(this.questions.length === 0){
            const qTitle = document.createElement('p');
            qTitle.innerText = '0 question';
            innerDiv.appendChild(qTitle);
        }else{
            const qTitle = document.createElement('h3');
            qTitle.innerText = `${this.questions.length} ${this.questions.length > 1 ? 'Questions' : 'Question'} `;
            innerDiv.appendChild(qTitle);
        }

        // create button group
        const btnGrp = document.createElement('div');
        btnGrp.classList.add('btn-group');
        const newestBtn = document.createElement('button');
        newestBtn.classList.add('btn-item');
        newestBtn.innerText = 'Newest';
        newestBtn.addEventListener('click', () => {
            this.displayByDateDesc();
        });
        btnGrp.appendChild(newestBtn);

        const activeBtn = document.createElement('button');
        activeBtn.classList.add('btn-item');
        activeBtn.classList.add('btn-item-middle');
        activeBtn.innerText = 'Active';
        activeBtn.addEventListener('click', () => {
            this.displayByActivity();
        });
        btnGrp.appendChild(activeBtn);

        const unanswrdBtn = document.createElement('button');
        unanswrdBtn.classList.add('btn-item');
        unanswrdBtn.innerText = 'Unaswered';
        unanswrdBtn.addEventListener('click', () => {
            this.displayUnanswered();
        });
        btnGrp.appendChild(unanswrdBtn);
        innerDiv.appendChild(btnGrp);
        parentDiv.appendChild(innerDiv);
    }

    createMainTitleDiv(parentDiv){
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('main-title-container');
        const title = document.createElement('h2');
        if(this.searching){
            title.innerText = 'Search Results';
        }else{
            title.innerText = 'All Questions';
        }
        
        title.classList.add('main-title');
        titleDiv.appendChild(title);

        const askBtn = document.createElement('button');
        askBtn.classList.add('ask-btn');
        askBtn.innerText = 'Ask Questions';
        askBtn.addEventListener('click', () => {
            this.clearDisplay('add-question-container');
            this.displayAskQuestion();
        });
        titleDiv.appendChild(askBtn);
        parentDiv.appendChild(titleDiv);
    }



    clearDisplay(newPage){
        const otherPages = this.pageContainers.filter((page) => page !== newPage);
        otherPages.forEach((page) => {
            document.getElementById(page).innerHTML = '';
        });
    }

    launch(){
        this.init();
    }

    setActiveLink(link){
        if(link === 'questions'){
          document.getElementById('questions-nav').classList.add('active');
          document.getElementById('tags-nav').classList.remove('active');
        }else if(link === 'tags'){

            document.getElementById('tags-nav').classList.add('active');
            document.getElementById('questions-nav').classList.remove('active');
        }else{
            document.getElementById('tags-nav').classList.remove('active');
            document.getElementById('questions-nav').classList.remove('active');
        }
      }




      formatTime(date) {

        let now = new Date();        
        const oneDay = 60 * 60 * 24 * 1000;
        const compareDatesBoolean = (now - date) > oneDay;
        if(compareDatesBoolean){

            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            
            if(((new Date()) - date) / (1000 * 3600 * 24 * 365) > 1){
                return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            }else{
                return `${months[date.getMonth()]} ${date.getDate()} at ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
            }

        }else{
            return this.processTime(date);
        }
      }

      processTime(date) {
        const formatter = new Intl.RelativeTimeFormat('en');
        const ranges = {
          years: 3600 * 24 * 365,
          months: 3600 * 24 * 30,
          weeks: 3600 * 24 * 7,
          days: 3600 * 24,
          hours: 3600,
          minutes: 60,
          seconds: 1
        };
        const secondsElapsed = (date.getTime() - Date.now()) / 1000;
        for (let key in ranges) {
          if (ranges[key] < Math.abs(secondsElapsed)) {
            const delta = secondsElapsed / ranges[key];
            return formatter.format(Math.round(delta), key);
          }
        }
        return 'few seconds ago';
      }
}