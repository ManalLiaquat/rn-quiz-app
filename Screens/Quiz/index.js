import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
// import { Camera, Permissions, FaceDetector } from 'expo';

export default class Quiz extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quiz: props.quiz
    }
    // this.onSelect = this.onSelect.bind(this)
  }

  // onSelect(index, value) {
  //   this.setState({ value })
  // }

  render() {
    let { quiz } = this.state
    // console.log(quiz);

    return (
      <View style={styles.container}>
        {

          quiz.map((v, i) => {
            let ranNum = Math.floor(Math.random() * 4)
            console.log(v, "manal");

            return (
              <View key={`${v.category}_${i}`}>
                <Text>{v.question}</Text>
                <RadioGroup onSelect={(index, value) => this.setState({ value })} >
                  {
                    v.incorrect_answers.map((val, index) => (
                      <RadioButton value={val} key={index}>
                        <Text>{val}</Text>
                      </RadioButton>
                    ))
                  }

                  <RadioButton value={v.correct_answer}>
                    <Text> {v.correct_answer} </Text>
                  </RadioButton>

                </RadioGroup>
              </View>
            )
          })

        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});