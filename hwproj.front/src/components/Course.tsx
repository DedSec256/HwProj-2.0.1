import * as React from 'react';
import { CourseViewModel, CoursesApi } from "../api/courses/api";
import { HomeworkViewModel, HomeworksApi } from '../api/homeworks/api'
import { AccountApi } from '../api/auth/api'
import CourseHomework from "./CourseHomework"
import {RouteComponentProps, Route} from "react-router-dom"
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AddHomework from './AddHomework';
import CourseStudents from './CourseStudents';
import AuthService from './AuthService';
import { Link as RouterLink } from 'react-router-dom'

interface User {
    name: string,
    surname: string,
    email: string,
    role: string
}

interface ICourseState {
    isLoaded: boolean,
    isFound: boolean,
    course: CourseViewModel,
    courseHomework: HomeworkViewModel[],
    createHomework: boolean,
    mentor: User,
    courseMates: string[]
}

interface ICourseProp {
    id: string
}

export default class Course extends React.Component<RouteComponentProps<ICourseProp>, ICourseState> {
    authService = new AuthService();
    coursesApi = new CoursesApi();
    homeworksApi = new HomeworksApi();
    authApi = new AccountApi();
    constructor(props : RouteComponentProps<ICourseProp>) {
        super(props);
        this.state = {
            isLoaded: false,
            isFound: false,
            course: {},
            courseHomework: [],
            createHomework: false,
            mentor: {
                name: "",
                surname: "",
                email: "",
                role: ""
            },
            courseMates: []
        };
    }

    public render() {
        const { isLoaded, isFound, course, createHomework, mentor } = this.state;
        if (isLoaded) {
            if (isFound) {
                let isLogged = this.authService.loggedIn();
                let userId = isLogged ? this.authService.getProfile()._id : undefined
                let isMentor = isLogged && userId === course.mentorId;
                let isSignedInCourse = isLogged && course.courseMates!.some(cm => cm.studentId === userId)
                let isAcceptedStudent = isLogged && course.courseMates!.some(cm => cm.studentId === userId && cm.isAccepted!)
                return (
                    <div className="container">
                        <div className="d-flex justify-content-between">
                            <div>
                                <Typography variant="h5">
                                    {course.name} &nbsp;
                                    {isMentor && 
                                        <RouterLink to={'./' + this.state.course.id + '/edit'}>
                                            <EditIcon fontSize="small" />
                                        </RouterLink>
                                    }
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    {course.groupName}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h5">
                                    {mentor.name}&nbsp;{mentor.surname}
                                </Typography>
                                {(isMentor || isSignedInCourse) &&
                                    <Typography variant="subtitle1">
                                        {mentor.email}
                                    </Typography>
                                }
                                {(isLogged && !isSignedInCourse && !isMentor) &&
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => this.joinCourse()}>Записаться</Button>
                                }
                            </div>
                        </div>
                        {createHomework &&
                            <div>
                                <CourseStudents courseMates={this.state.courseMates} homeworks={this.state.courseHomework} userId={userId} forMentor={isMentor} course={this.state.course} />
                                <br />
                                <AddHomework
                                id={+this.props.match.params.id}
                                onCancel={() => this.componentDidMount()}
                                onSubmit={() => this.componentDidMount()} />
                                <CourseHomework onDelete={() => this.componentDidMount()} forStudent={isAcceptedStudent} forMentor={isMentor} homework={this.state.courseHomework} />
                            </div>
                        }
                        {(isMentor && !createHomework) &&
                            <div>
                                <CourseStudents courseMates={this.state.courseMates} homeworks={this.state.courseHomework} userId={userId} forMentor={isMentor} course={this.state.course} />
                                <br />
                                <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => { this.setState({createHomework: true })}}>Добавить домашку</Button>
                                <CourseHomework onDelete={() => this.componentDidMount()} forStudent={isAcceptedStudent} forMentor={isMentor} homework={this.state.courseHomework} />
                            </div>
                        }
                        {isAcceptedStudent &&
                            <CourseStudents courseMates={this.state.courseMates} homeworks={this.state.courseHomework} userId={userId} forMentor={isMentor} course={this.state.course} />
                        }
                        {!isMentor &&
                            <div>
                                <CourseHomework onDelete={() => this.componentDidMount()} homework={this.state.courseHomework} forStudent={isAcceptedStudent} forMentor={isMentor}/>
                            </div>
                        }
                        
                    </div>
                )
            }

            return <Typography variant="h3">
                        Не удалось найти курс.
                    </Typography>
        }

        return <h1></h1>
    }

    joinCourse() {
        this.coursesApi.signInCourse(+this.props.match.params.id, 55);
    }

    async componentDidMount() {
        await this.coursesApi.get(+this.props.match.params.id)
            .then(res => res.json())
            .then((course : CourseViewModel) => this.homeworksApi.getCourseHomeworks(course.id!)
                .then(homework => this.authApi.getUserDataById(course.mentorId)
                    .then(res => res.json())
                    .then(async mentor => await Promise.all(course.courseMates!.map(async cm => {
                        let res = await this.authApi.getUserDataById(cm.studentId);
                        return res.json();
                    })).then(courseMates => this.setState({
                    isLoaded: true,
                    isFound: true,
                    course: course,
                    courseHomework: homework,
                    createHomework: false,
                    mentor: mentor,
                    courseMates: courseMates.map(cm => cm.surname + ' ' + cm.name)
            })))))
            .catch(err => this.setState({ isLoaded: true, isFound: false }))
    }
}