import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";

export default class RouterBase extends React.Component {
  init() {
    return null;
  }

  get(path, element) {
    return <Route key={path} path={path} element={element}/>;
  }

  render() {
    return (
        <BrowserRouter>
            <Routes>
                {this.init()}
            </Routes>
        </BrowserRouter>
    );
  }
}
