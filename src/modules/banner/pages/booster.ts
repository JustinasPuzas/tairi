class BoosterPage {
  page() {
    return `<html>
    <head>
      <style>
        body {
          width: 940px;
          height: 540px;
        }
        div{
          display: flex;
          direction: row;
          justify-content: space-around;
          aling-content: space-around;
        }
        img {
            width: 500px;
            height: 500px;
        }
      </style>
    </head>
    <body>
        <div>
            <img src="{{avatar}}"></img>
            <h1>Hello {{name}}</h1>
        </div>
    </body>
  </html>
  `;
  }
}

export default BoosterPage;
