// Libraries
import React, { PureComponent } from 'react'

// Components
import {
    Overlay, Form, FlexBox, AlignItems, FlexDirection, ComponentSize, Alert, ComponentColor,
    IconFont, ButtonType, Button,
} from '@influxdata/clockface'

class DangerConfirmationOverlay extends PureComponent {
    render() {
        const { visible, title, message, onClose, onConfirm } = this.props;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={450}>
                    <Overlay.Header
                        title={title}
                        onDismiss={onClose}
                    />
                    <Overlay.Body>
                        <Form>
                            <FlexBox
                                alignItems={AlignItems.Center}
                                direction={FlexDirection.Column}
                                margin={ComponentSize.Large}
                            >
                                <Alert color={ComponentColor.Danger} icon={IconFont.AlertTriangle}>
                                    Bad things could happen if you don't read this!
                                </Alert>
                                <Form.Element label="">
                                    <>
                                        <p>{message}</p>
                                    </>
                                </Form.Element>
                                <Form.Footer>
                                    <Button
                                        color={ComponentColor.Default}
                                        text={"CANCEL"}
                                        type={ButtonType.Submit}
                                        onClick={onClose}
                                    />
                                    <Button
                                        color={ComponentColor.Danger}
                                        text={"YES, I CONFIRM"}
                                        type={ButtonType.Submit}
                                        onClick={onConfirm}
                                    />
                                </Form.Footer>
                            </FlexBox>
                        </Form>
                    </Overlay.Body>
                </Overlay.Container>
            </Overlay>
        )
    }
}

export default DangerConfirmationOverlay
