import React, { Component, useContext, useImperativeHandle } from "react";
import Notification from "./Notification";

interface NotificationsProps {
}

interface NotificationsState {
    notifications: Notification[]
}

class Notifications extends Component<NotificationsProps, NotificationsState> {

    constructor(props: NotificationsProps) {
        super(props);
        this.state = { notifications: [] };
    }

    render() {
        return (
            <div>{this.state.notifications}</div>
        );
    }
}

export default Notification;
