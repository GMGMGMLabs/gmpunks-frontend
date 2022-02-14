import React, { Component } from "react";
import { Alert } from "react-bootstrap";

interface NotificationProps {
  msg: string,
  onClose(): void
}

class Notification extends Component<NotificationProps> {

  render() {
    //
    return (
        <Alert variant="info">
          <div className="notification-close" onClick={this.props.onClose}>x</div>
          {this.props.msg}
        </Alert>
    );
  }
}

export default Notification;
