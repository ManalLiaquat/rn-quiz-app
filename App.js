import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { Camera, Permissions, FaceDetector } from 'expo';
import Quiz from "./Screens/Quiz";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.front,
      isCameraOpen: false,
      isFace: false,
      quiz: []
    }
    this.handleFacesDetected = this.handleFacesDetected.bind(this)
    this.getQuiz = this.getQuiz.bind(this)
  }

  handleFacesDetected(param) {
    console.log(param.faces, "Hello");
    this.setState({
      isFace: param.faces.length > 0 ? true : false,
      isCameraOpen: param.faces.length > 0 ? false : true
    })
  }

  getQuiz() {
    fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple').then(res => res.json()).then(data => {
      this.setState({ quiz: data.results })
    })
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.getQuiz()
  }

  render() {
    const { hasCameraPermission, isFace, isCameraOpen, type, quiz } = this.state;
    return (
      hasCameraPermission === null ? <View /> : hasCameraPermission === false ? <Text>No access to camera</Text> : (
        isCameraOpen ? (
          <Camera style={{ flex: 1 }} type={type} onFacesDetected={this.handleFacesDetected} faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.fast,
            detectLandmarks: FaceDetector.Constants.Mode.none,
            runClassifications: FaceDetector.Constants.Mode.none,
          }} >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: type === Camera.Constants.Type.front
                      ? Camera.Constants.Type.back
                      : Camera.Constants.Type.front,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        ) : (
            <View style={styles.container} >
              {
                isFace ? (
                  <View>
                    {/* <Text>Congratulations you are logged in successfully</Text> */}
                    <Quiz quiz={quiz} />
                  </View>
                ) : (
                    <View>
                      <Text>Sign in with your face using camera</Text>
                      <Button color="green" onPress={() => { this.setState({ isCameraOpen: true }) }} title="Log In" />
                    </View>
                  )
              }
            </View>
          )
      )
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
