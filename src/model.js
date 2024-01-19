export default class Model {
  constructor() {
    this.data = {
      questions: [
                  {
                    qid: 'q1',
                    title: 'Programmatically navigate using React router',
                    text: 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
                    tagIds: ['t1', 't2'],
                    askedBy : 'JoJi John',
                    askDate: new Date('December 17, 2020 03:24:00'),
                    ansIds: [],
                    views: 10,
                  },
                  {
                    qid: 'q2',
                    title: 'android studio save string shared preference, start activity and load the saved string',
                    text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
                    tagIds: ['t3', 't4', 't2'],
                    askedBy : 'saltyPeter',
                    askDate: new Date('January 01, 2022 21:06:12'),
                    ansIds: ['a3', 'a4', 'a5'],
                    views: 121,
                  }
                ],
      tags: [
        {
          tid: 't1',
          name: 'react',
        },
        {
          tid: 't2',
          name: 'javascript',
        },
        {
          tid: 't3',
          name: 'android-studio',
        },
        {
          tid: 't4',
          name: 'shared-preferences',
        }
      ],

      answers: [
        {
          aid: 'a1',
          text: 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
          ansBy: 'hamkalo',
          ansDate: new Date('March 02, 2022 15:30:00'),
        },
        {
          aid: 'a2',
          text: 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
          ansBy: 'azad',
          ansDate: new Date('January 31, 2022 15:30:00'),
        },
        {
          aid: 'a3',
          text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
          ansBy: 'abaya',
          ansDate: new Date('April 21, 2022 15:25:22'),
        },
        {
          aid: 'a4',
          text: 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
          ansBy: 'alia',
          ansDate: new Date('December 02, 2022 02:20:59'),
        },
        {
          aid: 'a5',
          text: 'I just found all the above examples just too confusing, so I wrote my own. ',
          ansBy: 'sana',
          ansDate: new Date('December 31, 2022 20:20:59'),
        }
      ]
    };
  }

  queryQuestions(searchString){
    
    var matches = searchString.match(/\[(.*?)\]/);

    if (matches) {
        return this.queryQuestionsByTags(searchString);        
    }
    const questions = [...this.data.questions];

    const searchStrs = searchString.split(' ');

    const result = questions.filter((qtn) => {
        return searchStrs.some(ele => qtn.text.toLowerCase().includes(ele.toLowerCase()) || 
        qtn.title.toLowerCase().includes(ele.toLowerCase()));
    });

    return result;
  }

  queryQuestionsByTags(searchString){

    const questions = [...this.data.questions];
    const tags = [...this.data.tags];
    const sanitized = searchString.replace(/\s|\[|\]/g," ").trim();
    
    const searchStrs = sanitized.split(' ').filter((str) => str !== "");
    
    const mTags = tags.filter((tag) => {
      let res = false;
      for(let i = 0; i<searchStrs.length; i++){
          if(searchStrs[i].toLowerCase() === tag.name.toLocaleLowerCase()){
              res = true;
              break;
          }
       }
      return res;
    });

    const result = questions.filter((question) => {
      let res = false;
      for(let i = 0; i<mTags.length; i++){
          if(question.tagIds.includes(mTags[i].tid)){
              res = true;
              break;
          }
       }
      return res;
    });
   
    return result;
  }

  // add methods to query, insert, and update the model here. E.g.,
  getAllQstns() {
    return this.data.questions;
  }

  getQstnById(questionId) {
    return this.data.questions.find((qtn) => qtn.qid === questionId);
  }

  getUnansweredQuestions(){
    const questions = this.getQuestionByDateDesc();
    return questions.filter((qtn) => qtn.ansIds.length === 0);
  }

  getQuestionsByActivity(){
    const questions = this.data.questions;
    questions.sort(function(a,b){
      let aLatestAnswr = 0;
      if(a.ansIds.length > 0){
        const lastAAnswr = a.ansIds[a.ansIds.length - 1];
        aLatestAnswr = Number(lastAAnswr.match(/\d+/g));
      }

      let bLatestAnswr = 0;
      if(b.ansIds.length > 0){
        const lastBAnswr = b.ansIds[b.ansIds.length - 1];
        bLatestAnswr = Number(lastBAnswr.match(/\d+/g));
      }

      return bLatestAnswr - aLatestAnswr;
    });
    return questions;
  }

  getQuestionByDateDesc(){
    const questions = this.data.questions;
    questions.sort(function(a,b){return b.askDate.getTime() - a.askDate.getTime()});
    return questions;
  }

  getQuestionAnswers(questionId) {
    const question = this.data.questions.find((qtn) => qtn.qid === questionId);
    if(question){
      const data = this.data.answers.filter((ans) => question.ansIds.includes(ans.aid));
      return data;
    }
    return [];
  };

  getQuestionsByTag(tagId) {
      const data = this.data.questions.filter((question) => question.tagIds.includes(tagId));
      return data;
  };


  getQuestionTags(questionId) {
    const question = this.data.questions.find((qtn) => qtn.qid === questionId);
    if(question){
      const data = this.data.tags.filter((tag) => question.tagIds.includes(tag.tid));
      return data;
    }
    return [];
  };

  getAllTags() {
    const tags = [...this.data.tags];
    const tagMap = {};
    this.data.questions.forEach((qtn) => {
      qtn.tagIds.forEach((tid)=>{
        if(tagMap.hasOwnProperty(tid)){
          tagMap[tid] = tagMap[tid] + 1;
        }else{
          tagMap[tid] = 1;
        }
      });
    });
    const mappedTags = tags.map((tag) => {
      const modified = {
        ...tag
      }
      if(tagMap.hasOwnProperty(tag.tid)){
        modified.qCount = tagMap[tag.tid];
      }else{
        modified.qCount = 0;
      }
      return modified;
    });
    return mappedTags;
  };

  insertQstn(qtn){
    const tagIds = []
    const tags = qtn.tags.trim().split(' ');

    if(tags.length > 0){
      // insrt tags
      tags.forEach((tag) => {
        let tId = '';
        const pTag = this.data.tags.find((t) => t.name === tag);
        if(pTag){
          tId = pTag.tid;
        }else{
          tId = this.insertTag(tag);
        }
        tagIds.push(tId);
      });
    };
    const newQstn = {
      qid: `q${this.getCount("questions") + 1}`,
      title: qtn.title,
      text: qtn.text,
      tagIds,
      askedBy : qtn.username,
      askDate: new Date(),
      ansIds: [],
      views: 0,
    };
    let cloned = [...this.data.questions];
    cloned = [newQstn, ...cloned];
    this.data = {
      ...this.data,
      questions: cloned
    };
  }

  insertAnswr(answr, questionId){
    const cloned = [...this.data.answers];
    const clonedQtns = [...this.data.questions];
    const question = clonedQtns.find((qtn) => qtn.qid === questionId);
    if(question){
      //insert answer
      const aid = `a${this.getCount("answers") + 1}`;
      const newAnswr = {
        aid,
        text: answr.text,
        ansBy: answr.username,
        ansDate: new Date(),
      };
      cloned.push(newAnswr);
      //update question
      question.ansIds = [...question.ansIds, aid];
      const updated = this.updateImmutable(clonedQtns, question);
      this.data = {
        ...this.data,
        questions: updated,
        answers: cloned
      }
      
    }    
  }

  increamentViews(questionId){
    const clonedQtns = [...this.data.questions];
    const question = clonedQtns.find((qtn) => qtn.qid === questionId);
    if(question){
      question.views = question.views + 1;
      const updated = this.updateImmutable(clonedQtns, question);
      this.data = {
        ...this.data,
        questions: updated,
      }
    }    
  }

  //insrts a tag and return the new id
  insertTag(tag){
    const cloned = [...this.data.tags];
      const tid = `t${this.getCount("tags") + 1}`
      const newTag = {
        tid,
        name: tag,
      };
      cloned.push(newTag);
      this.data = {
        ...this.data,
        tags: cloned
      }
      return tid;
  }

  getCount(modelName){
    return this.data[modelName].length;
   }

   updateImmutable = (list, payload) => {
      const data = list.find((d) => d.qid === payload.qid);
      if (data) {
        const index = list.findIndex((d) => d.qid === payload.qid);
    
        return [
          ...list.slice(0, index),
          { ...data, ...payload },
          ...list.slice(index + 1)
        ];
      }
      return list;
    };
}


