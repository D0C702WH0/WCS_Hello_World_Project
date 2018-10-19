import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SlideInfos from './SlideInfos'
import { withStyles } from '@material-ui/core/styles';
import { TextField, Paper, MenuItem, Grid } from '@material-ui/core/';

import SearchIcon from '@material-ui/icons/Search';



const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 'auto',
        width: '250px',
        // [theme.breakpoints.up('sm')]: {
        //     width: '100vw',
        // }

    },
    select: {
        "&:before": {
            borderColor: 'green'
        },
    },
    input: {
        display: 'flex',
        padding: 5,
        height: '30px',
        borderRadius: '5px',
        backgroundColor: '#f3f8ff',
        color: '#315681',
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        color: '#315681',
    },
    noOptionsMessage: {
        padding: 5,
        backgroundColor: '#f3f8ff',
        color: '#315681',
    },
    countryChooseValue: {
        fontSize: 14,
        color: '#315681',
    },
    placeholder: {
        position: 'absolute',
        left: 10,
        fontSize: 14,
        color: '#315681',

    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    iconSearch: {
        color: '#315681'
    }
});


function NoOptionsMessage(props) {
    return (
        <div
            //color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </div>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                //backgroundColor: '#f3f8ff',
                // backgroundColor: props.isSelected ? '#315681' : '#f3f8ff',
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <div
            //color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </div>
    );
}

function countryChooseValue(props) {
    return (
        <div className={props.selectProps.classes.countryChooseValue} {...props.innerProps}>
            {props.children}
        </div>
    );
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}


const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    countryChooseValue,
    ValueContainer,
};

class SearchCountry extends React.Component {
    state = {
        countryChoose: null,
        error: null,
        isLoaded: false,
        showSlide: false,
        nameList: undefined,
    };

    componentDidMount() {
        fetch("https://restcountries.eu/rest/v2/all")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        nameList: result.map(e => ({
                            value: e.name,
                            label: e.name,
                        })),
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }

    handleChange = name => value => {
        if (value.value) {
            this.setState({
                [name]: value,
                showSlide: true,
            })
        }
    };

    //Remonte le props depuis l'enfant
    handleToUpdate = () => {
        this.setState({
            showSlide: false,
            countryChoose: null
        })
    }




    render() {
        const { classes } = this.props;
        const { error, isLoaded, nameList, showSlide, countryChoose } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        }
        else {
            return (
                <div className={classes.root}>
                    <Grid container
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                    >
                        <Grid item xs={2}>
                            <SearchIcon className={classes.iconSearch} />
                        </Grid>
                        <Grid item xs={10}>
                            <Select
                                className={classes.select}
                                classes={classes}
                                styles={styles}
                                options={nameList && nameList}
                                components={components}
                                value={countryChoose}
                                onChange={this.handleChange('countryChoose')}
                                placeholder={"Search a country ..."}
                            />
                        </Grid>

                        <SlideInfos
                            handleToUpdate={this.handleToUpdate}
                            showSlide={showSlide}
                            countryName={countryChoose && countryChoose.value}
                        />
                    </Grid>
                </div>

            );
        }
    }
}

SearchCountry.propTypes = {
    classes: PropTypes.object.isRequired,
    //theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchCountry);