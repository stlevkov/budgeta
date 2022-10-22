import React from "react";
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
    event.preventDefault();
}

class Incomes extends React.Component {
    state = {
        incomes: []
    };

    componentDidMount() {
        fetch("http://localhost:8080/api/incomes")
            .then(res => res.json())
            .then(incomes => this.setState({ incomes }));
    }

    render() {
        return (
            <React.Fragment>
                <Title>Recent Deposits</Title>
                <Typography component="p" variant="h4">
                    
                        {this.state.incomes.map(income => (
                            // <li key={user.id}>
                            //     <Link to={`/${user.id}`}> {user.name}</Link>
                            // </li>
                            <p>${income.name}</p>
                        ))}
                   
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                    on 15 March, 2019
                </Typography>
                <div>
                    <Link color="primary" href="#" onClick={preventDefault}>
                        View balance
                    </Link>
                </div>
            </React.Fragment>

        );
    }
}

export default Incomes;