import {MessageEditor} from '@/components/message-editor';
export const metadata={title:'Leave me a message'};
export default function Message(){return <main className="section shell message-page"><p className="eyebrow">A NOTE, JUST FOR ME</p><h1 className="portal-title">Leave me<br/><em>a message.</em></h1><p className="message-intro">Have a question, an idea, or something worth sharing? Write it here in Markdown. Messages go to my private inbox on GitHub and are never displayed on this website.</p><MessageEditor/></main>;}
