import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const apiKey = process.env.REACT_APP_API_KEY;

const initState = {
    category: 0,
    mark: 0,
    model: 0,
    categories: [],
    marks: [],
    models: [],
    types: [],
    gears: [],
    type: 0,
    gear: 0,
    year: 2018,
    data: {},
}

class App extends Component {
    state = { ...initState }
    async componentDidMount() {
        this.getInitData()
    }
    async componentDidUpdate(prevProps, prevState) {
        console.log(prevState, this.state)
        const {
            category,
            mark,
        } = this.state
        if (prevState.category !== category && category) {
            const date = await fetch(`https://developers.ria.com/auto/categories/${category}/marks?api_key=${apiKey}`)
            const marks = await date.json()
            const date2 = await fetch(`https://developers.ria.com/auto/categories/${category}/gearboxes?api_key=${apiKey}`)
            const gears = await date2.json()
            this.setState({ marks, gears })
            return
        }
        if (prevState.mark !== mark && mark) {
            const date = await fetch(`https://api.auto.ria.com/categories/${category}/marks/${mark}/models?api_key=${apiKey}`)
            const models = await date.json()
            this.setState({ models })
        }
        if (prevState.data.arithmeticMean === this.state.data.arithmeticMean) {
            this.calcAVGprice()
        }
    }
    calcAVGprice = async () => {
        if (this.doRecalcValidation()) {
            return
        }
        const {
            mark,
            model,
            gear,
            type,
            year,
        } = this.state
        const date = await fetch(`https://developers.ria.com/auto/average_price?api_key=${apiKey}&marka_id=${mark}&model_id=${model}&yers=${year}&fuel_id=${type}&gear_id=${gear}`)
        const data = await date.json()
        if (data.arithmeticMean !== this.state.data.arithmeticMean) {
            this.setState({ data })
        }
    }

    getInitData = async () => {
        const data = await fetch(`https://developers.ria.com/auto/categories/?api_key=${apiKey}`)
        const categories = await data.json()
        const data2 = await fetch(`https://developers.ria.com/auto/type?api_key=${apiKey}`)
        const types = await data2.json()
        this.setState({
            categories,
            types,
        })
    }
    resetSearch = () => {
        this.setState(initState, () => this.getInitData())
    }
    doRecalcValidation = () => (
        !this.state.mark ||
        !this.state.model ||
        !this.state.gear ||
        !this.state.type ||
        !this.state.year
    )
    render() {
        const { categories, marks, models, types, gears, data } = this.state
        return (
            <div className="App">
                <Button onClick={this.resetSearch}>RESET SEARCH</Button>
                {/*<Button*/}
                    {/*onClick={this.calcAVGprice}*/}
                    {/*color='primary'*/}
                    {/*disabled={this.doRecalcValidation()}*/}
                {/*>Recalc</Button>*/}
                <Form>
                    <FormGroup>
                        <Label for="exampleSelect4">Category</Label>
                        <Input
                            type="select"
                            name="select4"
                            id="exampleSelect4"
                            onChange={e => this.setState({ type: e.target.value })}
                            disabled={!types.length}
                            value={this.state.type}
                        >
                            <option disabled hidden value={0}>Select Type</option>
                            {types.map(e => (
                                <option key={e.value} value={e.value}>{e.name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleEmail">Year</Label>
                        <Input
                            type="number"
                            min={1900}
                            max={2018}
                            step={1}
                            value={this.state.year}
                            name="date"
                            id="exampleEmail"
                            placeholder="Choose date"
                            onChange={e => this.setState({ year: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleSelect1">Category</Label>
                        <Input
                            type="select"
                            name="select1"
                            id="exampleSelect1"
                            onChange={e => this.setState({ category: e.target.value, gear: 0, mark: 0, model: 0, data: {} })}
                            disabled={!categories.length}
                            value={this.state.category}
                        >
                            <option disabled hidden value={0}>Select Category</option>
                            {categories.map(e => (
                                <option key={e.value} value={e.value}>{e.name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleSelect6">Transmission</Label>
                        <Input
                            type="select"
                            name="select6"
                            id="exampleSelect6"
                            value={this.state.gear}
                            onChange={e => this.setState({ gear: e.target.value })}
                            disabled={!gears.length}
                        >
                            <option disabled hidden value={0}>Select Transmission types</option>
                            {gears.map(e => (
                                <option key={e.value} value={e.value}>{e.name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleSelect2">Marks</Label>
                        <Input
                            type="select"
                            name="select2"
                            id="exampleSelect2"
                            value={this.state.mark}
                            onChange={e => this.setState({ mark: e.target.value, model: 0, data: {} })}
                            disabled={!marks.length}
                        >
                            <option disabled hidden value={0}>Select Mark</option>
                            {marks.map(e => (
                                <option key={e.value} value={e.value}>{e.name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleSelect3">Model</Label>
                        <Input
                            type="select"
                            name="exampleSelect3"
                            id="exampleSelect2"
                            value={this.state.model}
                            onChange={e => this.setState({ model: e.target.value })}
                            disabled={!models.length}
                        >
                            <option disabled hidden value={0}>Select Model</option>
                            {models.map(e => (
                                <option key={e.value} value={e.value}>{e.name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                </Form>
                {data.total === 0 && <h3>Nothing found :(</h3>}
                {data.arithmeticMean && Number(data.arithmeticMean) && <h3>AVG PRISE: {data.arithmeticMean.toFixed(2)}$</h3>}
            </div>
        );
    }
}

export default App;
