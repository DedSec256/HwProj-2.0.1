import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Redirect } from 'react-router-dom';
import { AccountApi } from '../api/auth/api'
import AuthService from '../services/AuthService'

interface IEditProfileState {
    isLoaded: boolean,
    name: string,
    surname: string,
    edited: boolean
}

export default class EditProfile extends React.Component<{}, IEditProfileState> {
    authApi = new AccountApi();
    authService = new AuthService();
    constructor(props: {}) {
        super(props)
        this.state = {
            isLoaded: false,
            name: "",
            surname: "",
            edited: false
        };
    }
            
    public handleSubmit(e: any) {
        e.preventDefault();

        let editViewModel = {
            newName: this.state.name,
            newSurname: this.state.surname
        };

        this.authApi.edit(editViewModel)
            .then(res => this.setState({edited: true}))
    }

    public render() {
        if (this.state.edited) {
            return <Redirect to={'/'} />
        }

        if (this.state.isLoaded) {
            if (!this.authService.loggedIn()) {
                return <Typography variant='h6' gutterBottom>Страница не найдена</Typography>
            }

            return (
                <div>
                    <div className="container">
                        <Typography variant='h6' gutterBottom>Редактировать профиль</Typography>
                        <form onSubmit={e => this.handleSubmit(e)}>
                            <TextField
                                required
                                label="Имя"
                                variant="outlined"
                                margin="normal"
                                value={this.state.name}
                                onChange={e => this.setState({ name: e.target.value })}
                            />
                            <br />
                            <TextField
                                required
                                label="Фамилия"
                                variant="outlined"
                                margin="normal"
                                value={this.state.surname}
                                onChange={e => this.setState({ surname: e.target.value})}
                            />
                            <br />
                            <Button size="small" variant="contained" color="primary" type="submit">Редактировать профиль</Button>
                        </form>
                    </div>
                </div>
            );
        }

        return "";
    }

    componentDidMount() {
        if (this.authService.loggedIn()) {
            this.authApi.getUserDataById(this.authService.getProfile()._id)
            .then(res => res.json())
            .then(user => this.setState({
                isLoaded: true,
                name: user.name,
                surname: user.surname,
            }))
        }
    }
}