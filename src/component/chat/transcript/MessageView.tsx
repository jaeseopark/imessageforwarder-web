import cls from "classnames";

import IMFMessage, { IMFAttachment } from "typedef/IMFMessage";

import { getAttachmentUrl } from "redux/mdlwr";

import "style/MessageView.scss";
import HeicImg from "component/common/HeicImg";
import TinyLinkify from "component/common/TinyLinkify";

type MessageViewProps = {
    message: IMFMessage;
};

const AttachmentElement = ({ attachment }: { attachment: IMFAttachment }) => {
    const { mimetype, id, size } = attachment;
    if (mimetype) {
        const url = getAttachmentUrl(id);
        if (mimetype === "image/heic") {
            return <HeicImg src={url} size={size} />;
        } else if (mimetype.startsWith("image/")) {
            return <img src={url} alt="Attachment" />;
        } else if (mimetype.startsWith("video/")) {
            return <video src={url} controls />;
        }
        return <span>(Unsupported: {mimetype})</span>;
    }
    return null;
};

const MessageView = ({ message }: MessageViewProps) => {
    const clsView = cls("message-view", message.status);
    const clsBubble = cls("message-bubble", message.status, message.service);

    const getAttachments = () => {
        const hasAttachment = !!message.content.attachments;
        if (!hasAttachment) return null;
        return message.content.attachments!.map((attachment) => (
            <div key={attachment.id}>
                <AttachmentElement attachment={attachment} />
            </div>
        ));
    };

    const getText = () => {
        const hasText = !!message.content.text;
        if (!hasText) return null;
        return (
            <div className="text" key={message.id}>
                <TinyLinkify>{message.content.text!}</TinyLinkify>
            </div>
        );
    };

    return (
        <div className={clsView}>
            <div className={clsBubble}>
                {getAttachments()}
                {getText()}
            </div>
        </div>
    );
};

export default MessageView;
