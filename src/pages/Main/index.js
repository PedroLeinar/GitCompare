import React, { Component } from 'react';
import moment from 'moment';
import api from '../../services/api';
import logo from '../../assets/logo.png';
import { Container, Form } from './styles';
import CompareList from '../../components/CompareList/index';
import 'font-awesome/css/font-awesome.css';

export default class Main extends Component {
  state = {
    repositoryError: false,
    loading: false,
    repositoryInput: '',
    repositories: []
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(
        `/repos/${this.state.repositoryInput}`
      );
      repository.lastCommit = moment(repository.pushed_at).fromNow();

      console.log(repository);

      this.setState({
        repositories: [...this.state.repositories, repository],
        repositoryInput: '',
        repositoryError: false
      });
    } catch (err) {
      this.setState({ repositoryError: true });
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { repositoryError, repositories, loading } = this.state;
    return (
      <Container>
        <img src={logo} alt="logo" />

        <Form withError={repositoryError} onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Usuario/repositorio"
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}
          </button>
        </Form>
        <CompareList tech={repositories} />
      </Container>
    );
  }
}
