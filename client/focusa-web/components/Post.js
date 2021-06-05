import Link from "next/link";

function Post({ parent, author, course, time, text, attachmentURL }) {
    return (
        <div>
            {
                parent && parent.length > 0 ?
                    <h4>
                        <Link href={`/post/${parent}`}>Comment</Link>
                    </h4>
                    : null
            }
            {
                course && course.length > 0 ?
                    <h4>
                        {course}
                    </h4>
                    : null
            }

            <span style={{ color: 'gray' }}>
                {author} &nbsp; | &nbsp; {formatTime(time)}
            </span>
            
            <p>
                {text}
            </p>

            {
                attachmentURL && attachmentURL.length > 0 ?
                    <div>
                        <Link href={attachmentURL}>View Attachment</Link>
                    </div>
                    : null
            }
            <hr/>
        </div>
    );
}

export const formatTime = (time) => {
    var TimeType, hour, minutes, fullTime;

    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    try {
        const date = new Date(parseInt(time));
        hour = date.getHours();

        // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
        if (hour <= 11) {
            TimeType = 'AM';
        }
        else {
            // If the Hour is Not less than equals to 11 then Set the Time format as PM.
            TimeType = 'PM';
        }
        // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
        if (hour > 12) {
            hour = hour - 12;
        }

        // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format. 
        if (hour == 0) {
            hour = 12;
        }

        // Getting the current minutes from date object.
        minutes = date.getMinutes();

        // Checking if the minutes value is less then 10 then add 0 before minutes.
        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        }
        fullTime = hour.toString() + ':' + minutes.toString() + ' ' + TimeType.toString();

        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${fullTime}`;

    } catch (e) {
        console.error(e);
        return 'Invalid Time';
    }
}

export default Post;