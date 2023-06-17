// Function to identify negative words
function identifyNegativeWords(content) {
    const negativeWords = [
      'hate',
      'angry',
      'dislike',
      'terrible',
      'awful',
      'horrible',
      'offensive',
      'disgusting',
      'repulsive',
      'vile'
      // Add more negative words to the list as needed
    ];
  
    const foundNegativeWords = [];
    const words = content.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      if (negativeWords.includes(words[i])) {
        foundNegativeWords.push(words[i]);
      }
    }
  
    return foundNegativeWords;
  }
  
  
  // Apply highlighting and blurring effects
  function applyEffects(negativeWords) {
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const elements = Array.from(document.querySelectorAll('*:not(script):not(style):not(noscript):not(textarea):not(input):not(select)')).filter(element => {
        return element.innerText && regex.test(element.innerText.toLowerCase());
      });
  
      elements.forEach(element => {
        const text = element.innerText;
        const matches = Array.from(text.matchAll(regex));
  
        matches.forEach(match => {
          const startIndex = match.index;
          const endIndex = match.index + match[0].length;
  
          const range = document.createRange();
          const textNode = findTextNode(element, startIndex);
          if (textNode && startIndex <= textNode.textContent.length && endIndex <= textNode.textContent.length) {
            range.setStart(textNode, startIndex);
            range.setEnd(textNode, endIndex);
  
            const span = document.createElement('span');
            span.style.backgroundColor = 'yellow';
            span.style.filter = 'blur(3px)';
            range.surroundContents(span);
          }
        });
      });
    });
  }
  
  
  
  
  function findTextNode(element, offset) {
    const nodeIterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT);
    let currentNode = nodeIterator.nextNode();
    let currentPosition = 0;
  
    while (currentNode) {
      const nodeLength = currentNode.length;
      if (currentPosition + nodeLength >= offset) {
        if (offset >= currentPosition) {
          const textNode = currentNode.splitText(offset - currentPosition);
          return textNode;
        } else {
          return currentNode;
        }
      }
      currentPosition += nodeLength;
      currentNode = nodeIterator.nextNode();
    }
  
    return null;
  }
  
  
  
  
  
  
  
  
  
  // Initial analysis and effects application
  const pageContent = document.body.textContent;
  const negativeWords = identifyNegativeWords(pageContent);
  applyEffects(negativeWords);
  
  // Observer for dynamic content changes
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const addedNodes = Array.from(mutation.addedNodes);
      addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const updatedNegativeWords = identifyNegativeWords(node.textContent);
          applyEffects(updatedNegativeWords);
        }
      });
    });
  });
  
  const observerConfig = {
    childList: true,
    subtree: true
  };
  
  observer.observe(document.body, observerConfig);
  