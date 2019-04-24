const TextHelper ={
  removeExtraCharacter: (text) => {
    if (!text) return '';
    text = text.replace(new RegExp('<br/>', 'g'), '');
    text = text.replace(new RegExp('<p></p>', 'g'), '');
    text = text.replace(new RegExp('<b></b>', 'g'), '');
    text = text.replace(new RegExp('<p', 'g'), '<span');
    text = text.replace(new RegExp('</p>', 'g'), '</span>');
    text = text.replace(new RegExp('<span><br></span>', 'g'), '');
    text = text.replace(new RegExp('<li><li/>', 'g'), '');
    if (text.startsWith('<br/>')) text = text.substr(5, text.length);
    return text;
  },
};

export default TextHelper;