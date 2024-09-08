import React, {Component} from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {Input_Label, Section, Spinner} from "../common";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {Dropdown} from 'react-native-material-dropdown-v2';
import axios from 'axios';
import NotificationBadge from '../common/NotificationBadge';
import {connect} from 'react-redux';
import {APP_KEY, BASE_URL} from './../../../config/settings';
import {CheckBox} from 'react-native-elements';

let radio_props = [
  {label: 'Multiple', value: 0},
  {label: 'On', value: 1}
];

class EditProduct extends Component {

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;

    return {
      title: <Text style={{fontWeight: "400", fontSize: 17}}>Edit Product</Text>,
      headerRight: <TouchableOpacity onPress={() => {
        navigation.navigate('Notifications');
      }}>
        <NotificationBadge/>
      </TouchableOpacity>,
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#50b7ed'
      },
      headerTintColor: 'white',

    };
  };

  constructor(props) {
    super(props);
    this.state = {
      types3: [{label: 'Multiple', value: 0}, {label: 'One', value: 1}],
      value3: 0,
      value3Index: 0,
      loaded: false,
      product: null,
      options: [],
      additions: [],
      available: false,
      delete: [],
      option_selected_type: 0,
      option_selected_required: false,
      addition_selected_type: 0,
      error: null,
      checked: false
    }

  }

  renderError() {
    if (this.state.error !== null)
      return (
        <View style={{backgroundColor: 'white'}}>
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
        </View>
      );
  }

  componentWillMount() {

    const {params} = this.props.navigation.state;
    //is_popular + available
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/products/${params.id}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.parseProduct(response.data.product))
      .catch(error => console.log(error))


  }

  parseProduct = (product) => {
    console.log(product);
    let options = product.options;
    delete product.options;
    this.setState({
      product: product,
      available: product.available,
      option_selected_type: product.option_selected_type,
      option_selected_required: product.option_selected_required === 1 ? true : false,
      addition_selected_type: product.addition_selected_type
    });
    this.parseOptions(options);
  }

  parseOptions = (data) => {
    let options = [];
    let additions = [];

    if (data !== null)
      data.map(opt => {
        if (opt.type === 'addition')
          additions.push(opt)
        else
          options.push(opt)
      })

    this.setState({options: options, additions: additions, loaded: true});
    return;
  }

  updateProduct = (obj) => {
    if (obj instanceof Object)
      this.setState({product: Object.assign({}, this.state.product, obj)})
  }

  onUpdateButtonPress = () => {
    const {params} = this.props.navigation.state;
    const {token, vendor} = this.props;

    if (!this.validateFields()) {
      this.setState({error: 'Fill in all the fields'});
      return;
    }

    let data = this.createPostData();

    axios.put(`${BASE_URL}/vendors/${vendor}/products/${params.id}`,
      data,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => Alert.alert('Product updated with success'))
      .catch(error => {
          switch (error.response) {
            case 'Validate':
              Alert.alert('Please fill all the fields');
              return;
            default:
              Alert.alert('An error occoured');
          }
        }
      )

  };

  validateFields = () => {
    // title, price, variations
    if (this.state.product.title === '')
      return false

    if (this.state.product.price === '')
      return false

    let optionsValidated = this.state.options.filter(option => option.title === '');
    let additionsValidated = this.state.additions.filter(addition => (addition.title === '' || addition.price === ''));

    if (optionsValidated.length !== 0 || additionsValidated.length !== 0)
      return false;

    return true;
  }

  createPostData = () => {
    let additions = [];
    let additions_new = [];
    let options = [];
    let options_new = [];

    this.state.additions.map(addition => {
      if (/^\d+$/.test(addition.id))
        additions.push(addition);
      else
        additions_new.push(addition);
    });

    this.state.options.map(option => {
      if (/^\d+$/.test(option.id))
        options.push(option);
      else
        options_new.push(option)
    });

    let data = {
      title: this.state.product.title,
      description: this.state.product.description,
      available: this.state.available,
      is_popular: this.state.product.is_popular, //kur te shtohet ne API!!
      price: this.state.product.price,
      additions: additions,
      options: options,
      additions_new: additions_new,
      options_new: options_new,
      delete: this.state.delete,
      option_selected_type: this.state.option_selected_type,
      option_selected_required: this.state.option_selected_required === true ? 1 : 0,
      addition_selected_type: this.state.addition_selected_type
    }
    return data;
  }

  updateAvailability = (value) => {
    this.setState(value === "Yes" ? {available: 1} : {available: 0})
  };

  updatePopularity = (value) => {
    if (value === 'Yes')
      this.updateProduct({is_popular: 1});
    else
      this.updateProduct({is_popular: 0});
  }

  deleteOption = (obj) => {

    //If the option is new, do not add to this.state.delete
    if (/^\d+$/.test(obj.id))
      this.state.delete.push(obj.id);

    //Remove object from array
    let filtered;
    if (obj.type === 'addition') {
      filtered = this.state.additions.filter(addition => obj.id !== addition.id);
      this.setState({additions: filtered});
    } else if (obj.type === 'option') {
      filtered = this.state.options.filter(option => obj.id !== option.id);
      this.setState({options: filtered})
    }

  };

  renderOptionsHeader = () => {
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.labelStyle, {fontSize: 14, marginLeft: 22}]}>Product Options</Text>

          <View style={{marginTop: 15,}}>
            <RadioForm formHorizontal={true} animation={true}>
              {this.state.types3.map((obj, i) => {
                let onPress = (value, index) => {
                  this.setState({
                    value3: value,
                    option_selected_type: index
                  })
                };
                return (
                  <RadioButton labelHorizontal={true} key={i}>
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={this.state.option_selected_type === i}
                      onPress={onPress}
                      buttonInnerColor={'#50b7ed'}
                      buttonOuterColor={this.state.option_selected_type === i ? '#50b7ed' : '#4D4D4D'}
                      buttonSize={10}
                      buttonStyle={{}}
                      buttonWrapStyle={{marginLeft: 10, marginRight: 5}}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      onPress={onPress}
                      labelStyle={{fontFamily: 'SF_medium', fontSize: 13, color: '#000000'}}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                )
              })}
            </RadioForm>
          </View>

          <CheckBox
            containerStyle={{backgroundColor: 'transparent', marginLeft: 2, marginTop: 5}}
            size={14.5}
            textStyle={{
              color: this.state.option_selected_required === true ? '#50b7ed' : '#000000',
              fontSize: 14.5,
              marginLeft: 5
            }}
            title='Required'
            checkedColor={'#50b7ed'}
            fontFamily={'SF_semibold'}
            checked={this.state.option_selected_required}
            onPress={() => this.setState({option_selected_required: !this.state.option_selected_required})}

          />

        </View>


      </View>
    );
  }

  renderOption = (option) => {
    let id = option.id;
    return (
      <View key={option.id} style={{marginLeft: 8, marginRight: 10, padding: 10, flexDirection: 'row', marginTop: -10}}>

        <Section style={{width: '80%'}}>
          <TextInput
            underlineColorAndroid="transparent"
            key={option.id}
            placeholder={"Option"}
            style={styles.optionStyle}
            value={option.title}
            onChangeText={(text) => this.updateOption(id, text)}
            autoCorrect={false}
            placeholderTextColor={'#808080'}
          />
        </Section>

        <Section style={{width: '20%', marginLeft: 5}}>
          <TouchableOpacity onPress={() => {
            this.deleteOption(option)
          }}>
            <View style={{backgroundColor: '#e2353e', padding: 5, borderRadius: 5}}>
              <Text style={{textAlign: 'center', color: 'white', marginRight: 5}}> X </Text>
            </View>
          </TouchableOpacity>
        </Section>
      </View>

    );
  };

  updateOption = (id, data) => {
    let options = this.state.options.map(option => {
      if (option.id === id)
        option.title = data;
      return option;
    })
    this.setState({options: options});
  };

  renderOptions = () => {
    return (
      <View style={{backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.labelStyle, {flex: 1, fontSize: 14, marginTop: 12}]}>Variation</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: 25, flex: 1, marginTop: 12}}>
            <TouchableOpacity onPress={() => {
              this.addNewOption('option')
            }}>
              <Text style={{fontFamily: 'SF_medium', fontSize: 14, color: '#808080'}}>
                Add Option
              </Text>
            </TouchableOpacity>
            {
              //Plus !!
            }
          </View>
        </View>
        <Section style={{flex: 1, flexDirection: 'column'}}>
          {this.state.options.map(option => this.renderOption(option))}
        </Section>
      </View>
    );
  }

  addNewOption = (type) => {
    let options;
    let typeString;
    if (type === 'option')
      options = this.state.options;
    else
      options = this.state.additions;

    let id = 'new#' + options.length;
    if (type === 'option') {
      options.push({id: id, title: '', price: '00', type: 'option'});
      this.setState({options: options})
    } else {
      options.push({id: id, title: '', price: '', type: 'addition'});
      this.setState({additions: options})
    }

  };

  renderAdditionsHeader = () => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 5}}>
        <Text style={[styles.labelStyle, {flex: 1}]}>Addition</Text>

        <View style={{marginTop: 10, justifyContent: 'flex-end', flex: 1}}>
          <RadioForm formHorizontal={true} animation={true}>
            {this.state.types3.map((obj, i) => {
              let onPress = (value, index) => {
                this.setState({
                  value3: value,
                  addition_selected_type: index
                })
              };
              return (
                <RadioButton labelHorizontal={true} key={i}>
                  {/*  You can set RadioButtonLabel before RadioButtonInput */}
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={this.state.addition_selected_type === i}
                    onPress={onPress}
                    buttonInnerColor={'#50b7ed'}
                    buttonOuterColor={this.state.addition_selected_type === i ? '#50b7ed' : '#4D4D4D'}
                    buttonSize={10}
                    buttonStyle={{}}
                    buttonWrapStyle={{marginLeft: 10, marginRight: 5}}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    onPress={onPress}
                    labelStyle={{fontFamily: 'SF_medium', fontSize: 14, color: '#000000'}}
                    labelWrapStyle={{}}
                  />
                </RadioButton>
              )
            })}
          </RadioForm>
        </View>
      </View>
    );
  }

  renderAddition = (addition) => {
    let id = addition.id;
    return (
      <View key={addition.id} style={{marginLeft: 8, marginRight: 10, padding: 10, flexDirection: 'row'}}>
        <Section style={{width: '50%'}}>
          <TextInput
            underlineColorAndroid="transparent"
            key={addition.id}
            placeholder={"Adition"}
            style={styles.optionStyle}
            value={addition.title}
            onChangeText={(text) => this.updateAddition(id, text, 'title')}
            autoCorrect={false}
            placeholderTextColor={'#808080'}
          />
        </Section>

        <Section style={{width: '30%'}}>
          <TextInput
            underlineColorAndroid="transparent"
            key={addition.id}
            //keyboardType={"numeric"}
            placeholder={"Price"}
            style={[styles.optionStyle, {width: '80%'}]}
            value={addition.price}
            onChangeText={(text) => this.updateAddition(id, text, 'price')}
            autoCorrect={false}
            placeholderTextColor={'#808080'}
          />
        </Section>

        <Section style={{width: '20%'}}>
          <TouchableOpacity onPress={() => {
            this.deleteOption(addition)
          }}>
            <View style={{backgroundColor: '#e2353e', padding: 5, borderRadius: 5}}>
              <Text style={{textAlign: 'center', color: 'white', marginRight: 5}}> X </Text>
            </View>
          </TouchableOpacity>
        </Section>
        {
          /*
          <Section style={{width: '10%', marginTop: 27}}>
              <Image style={{width: '10%', height: 45, borderWidth: 2, borderColor: 'blue'}}
                      source={require('../../img/Products/Asset8.png')}/>
          </Section>
          */
        }
      </View>
    );
  }

  updateAddition = (id, data, type) => {
    let additions = this.state.additions.map(addition => {
      if (addition.id === id)
        if (type === 'title')
          addition.title = data;
        else
          addition.price = data;
      return addition;
    });

    this.setState({additions: additions});
  }

  renderAdditions = () => {
    return (
      <View style={{backgroundColor: 'white'}}>

        <View style={{marginLeft: 8, marginRight: 10, marginTop: 8, flexDirection: 'row'}}>
          <Section style={{width: '40%'}}>
            <Text style={styles.labelStyleAddition}>Variation</Text>
          </Section>
          <Section style={{width: '30%'}}>
            <Text style={styles.labelStyleAddition}>Price</Text>
          </Section>
          <Section style={{width: '30%'}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: 15, flex: 1, marginBottom: 8}}>
              <TouchableOpacity onPress={() => {
                this.addNewOption('addition')
              }}>
                <Text style={{fontFamily: 'SF_medium', fontSize: 14, color: '#808080'}}>
                  Add Addition
                </Text>
              </TouchableOpacity>
            </View>
          </Section>
        </View>
        {
          this.state.additions.map(addition => this.renderAddition(addition))
        }
      </View>
    );
  }

  render() {
    const {product, loaded} = this.state;

    if (loaded)
      return (
        <KeyboardAvoidingView behavior={"padding"}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

              <View>

                <View style={{backgroundColor: 'white'}}>
                  <Section style={{marginLeft: 8, marginTop: 10, marginRight: 15}}>
                    <Input_Label
                      styleInput={styles.styleInput}
                      label="Title"
                      value={product.title}
                      onChangeText={title => this.updateProduct({title: title})}
                      placeholder={"Product Title"}

                    />
                  </Section>
                  <Section style={{marginLeft: 8, marginRight: 15, marginTop: -10}}>
                    <Input_Label
                      styleInput={[styles.styleInput, {height: 50}]}
                      label="Description"
                      value={product.description}
                      onChangeText={description => this.updateProduct({description: description})}
                    />
                  </Section>
                  <View style={{marginLeft: 8, marginRight: 15, flexDirection: 'row'}}>
                    <Section style={{width: '50%'}}>

                      <View style={styles.containerStyle}>
                        <View style={styles.containerDropdown}>
                          <Dropdown
                            label={'Publish'}
                            value={this.state.available === 0 ? "No" : "Yes"}
                            data={[{value: 'Yes',}, {value: 'No',}]}
                            itemTextStyle={{fontFamily: 'SF_semibold', color: '#292D2E'}}
                            itemCount={2}
                            fontSize={14}
                            onChangeText={value => this.updateAvailability(value)}
                          />
                        </View>
                      </View>
                    </Section>
                    <Section style={{width: '50%'}}>
                      <View style={styles.containerStyle}>
                        <View style={styles.containerDropdown}>
                          <Dropdown
                            label={'Popular'}
                            value={this.state.product.is_popular === 0 ? "No" : "Yes"}
                            data={[{value: 'Yes',}, {value: 'No',}]}
                            itemTextStyle={{fontFamily: 'SF_semibold', color: '#292D2E'}}
                            itemCount={2}
                            fontSize={14}
                            onChangeText={value => this.updatePopularity(value)}
                          />
                        </View>
                      </View>

                    </Section>

                  </View>
                  <Section style={{marginLeft: 8, marginRight: 15, marginTop: -10}}>
                    <Input_Label
                      styleInput={styles.styleInput}
                      label="Price"
                      placeholder={"Enter price"}
                      //keyboardType={"numeric"}
                      value={product.price}
                      onChangeText={price => this.updateProduct({price: price})}
                    />
                  </Section>
                </View>

                {/* Render Options Header     */}
                {this.renderOptionsHeader()}
                {this.renderOptions()}


                {/* Render Additions    */}
                {this.renderAdditionsHeader()}
                {this.renderAdditions()}


                <View style={{backgroundColor: 'white'}}>
                  <View style={{alignItems: 'center', marginBottom: 20}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                      this.onUpdateButtonPress()
                    }}>
                      <Text style={styles.buttonText}>
                        Update
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {this.renderError()}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    else
      return <Spinner/>
  }
};

const styles = {
  styleInput: {
    fontSize: 14,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
    fontFamily: 'SF_light'
  },
  labelStyle: {
    marginLeft: 22,
    marginTop: 15.5,
    fontSize: 15,
    marginBottom: 10,
    fontFamily: 'SF_semibold',
    color: '#000000',
  },
  labelStyleAddition: {
    marginLeft: -50,
    marginTop: 5,
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'SF_semibold',
    color: '#000000',
  },
  optionStyle: {
    color: '#808080',
    paddingRight: 5,
    paddingLeft: 10,
    marginLeft: 5,
    lineHeight: 23,
    height: 40,
    borderRadius: 5,
    fontSize: 15,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
    fontFamily: 'SF_light',
    flex: 1
  },
  buttonText: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },
  buttonStyle: {
    borderRadius: 30,
    backgroundColor: '#50b7ed',
    marginTop: 15,
    width: '40%',
    height: 35,
    justifyContent: 'center',
  },
  containerStyle: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: 10,

  },
  errorTextStyle: {
    fontSize: 14,
    alignSelf: 'center',
    color: '#e2353e',
    fontFamily: 'SF_medium'
  },

  containerDropdown: {
    paddingTop: 0,
    marginLeft: 5,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
  },

};
const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id
  };
};

export default connect(mapStateToProps)(EditProduct);
