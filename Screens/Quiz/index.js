import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, TouchableOpacity } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';

export default class Quiz extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quiz: props.quiz,
      value: '',
      correctAns: '',
      correct: 0,
      score: 0,
      min: null,
      sec: null,
      showQuiz: true
    }
    this.minute = 2;
    this.second = 1;
    this.timeStart = null;
    this.timer = this.timer.bind(this);
    this.endQuiz = this.endQuiz.bind(this);
    this.reTake = this.reTake.bind(this);
  }

  timer() {
    this.timeStart = setInterval(() => {
      this.setState({
        min: this.minute,
        sec: this.second
      });
      this.second--;
      if (this.second === 0) {
        this.second = 60;
        this.minute--;
        this.setState({
          sec: this.second,
          min: this.minute
        });
        if (this.minute < 0) {
          this.endQuiz()
        }
      }
    }, 1000);
  }

  endQuiz() {
    clearInterval(this.timeStart);
    var { score, correct, quiz } = this.state;
    this.setState({
      min: 0,
      sec: 0
    });
    score = correct * (100 / quiz.length).toFixed(2);
    this.setState({
      score, showQuiz: false
    });
  }

  reTake() {
    this.minute = 2;
    this.second = 1;
    this.timeStart = null;
    this.setState({
      value: '',
      correctAns: '',
      correct: 0,
      score: 0,
      min: null,
      sec: null,
      showQuiz: true
    })
    this.timer();
  }

  componentDidMount() {
    this.timer()
  }

  render() {
    let { quiz, value, correct, min, sec, showQuiz, score } = this.state
    console.log(value);

    return (
      <View style={styles.container}>
        {
          showQuiz ? (
            <ScrollView>
              <Text>Timer: {min}:{sec}</Text>
              {
                quiz.map((v, i) => {
                  var radio_props = [
                    { label: v.correct_answer, value: v.correct_answer },
                    { label: v.incorrect_answers[0], value: v.incorrect_answers[0] },
                    { label: v.incorrect_answers[1], value: v.incorrect_answers[1] },
                    { label: v.incorrect_answers[2], value: v.incorrect_answers[2] }
                  ];

                  return (
                    <View key={`${v.category}_${i}`}>
                      <Text style={{ marginBottom: 5 }}>Q. {v.question}</Text>

                      <RadioForm radio_props={radio_props}
                        formHorizontal={false}
                        labelHorizontal={true}
                        buttonColor={'green'}
                        animation={false}
                        initial={-1}
                        onPress={(value) => { this.setState({ value, correct: (value === v.correct_answer) ? ++correct : correct }) }}
                      />
                    </View>
                  )
                })

              }
              <TouchableOpacity style={styles.btn} onPress={this.endQuiz}>
                <Text>Submit</Text>
              </TouchableOpacity>
            </ScrollView>) : (
              <View>
                <Text>Total Questions: {quiz.length}</Text>
                <Text>Correct: {correct}</Text>
                <Text>In Correct: {quiz.length - correct}</Text>
                <Text>You scored: {score}%</Text>
                <Text>RESULT: {score > 70 ? "PASS" : "FAIL"}</Text>
                <TouchableOpacity style={styles.btn} onPress={this.reTake}>
                  <Text>Retake Quiz</Text>
                </TouchableOpacity>
              </View>
            )
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
  },
  btn: {
    backgroundColor: "lightgreen",
    padding: 10,
    alignItems: "center",
    margin: 10,
    borderRadius: 5,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "black",
  }
});