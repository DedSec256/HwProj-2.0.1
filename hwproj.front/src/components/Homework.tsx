import * as React from 'react';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ReactMarkdown from 'react-markdown';
import { HomeworkViewModel, HomeworksApi} from "../api/homeworks/api";
import AddTask from'./AddTask'
import HomeworkTasks from './HomeworkTasks'

interface IHomeworkProps {
    id: number,
    onDeleteClick: () => void
}

interface IHomeworkState {
    isLoaded: boolean,
    isFound: boolean,
    homework: HomeworkViewModel,
    createTask: boolean
}

export default class Homework extends React.Component<IHomeworkProps, IHomeworkState> {
    constructor(props : IHomeworkProps) {
        super(props);
        this.state = {
            isLoaded: false,
            isFound: false,
            homework: {},
            createTask: false
        };
    }

    public render() {
        const { isLoaded, isFound, homework, createTask } = this.state;

        if (isLoaded) {
            if (isFound) {
                let homeworkDateString = new Date(homework.date!.toString()).toLocaleDateString("ru-RU");
                return (
                    <div>
                        <Typography variant="subtitle1" gutterBottom>
                            <b>{homework.title}</b> {homeworkDateString}
                            <IconButton aria-label="Delete" onClick={() => this.deleteHomework()}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Typography>
                        <ReactMarkdown source={homework.description} />
                        
                        {this.state.createTask && 
                            <div>
                                <HomeworkTasks id={this.props.id} />
                                <AddTask
                                id={homework.id!}
                                onAdding={() => this.setState({createTask: false})} />
                            </div>
                        }
                        {!this.state.createTask &&
                            <div>
                                <HomeworkTasks id={this.props.id} />
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { this.setState({createTask: true })}}>Добавить задачу</Button>
                            </div>
                        }
                    </div>
                )
            }
        }

        return <h1></h1>
    }

    deleteHomework(): void {
        let api = new HomeworksApi();
        api.deleteHomework(this.props.id)
            .then(res => this.props.onDeleteClick());
    }

    componentDidMount(): void {
        let api = new HomeworksApi();
        api.getHomework(this.props.id)
            .then(res => res.json())
            .then(homework => this.setState({
                isLoaded: true,
                isFound: true,
                homework: homework
            }))
            .catch(err => this.setState({
                isLoaded: true,
                isFound: false
            }));
    }
}