export const promptContent = `Imagine you are an English Language Teacher
  Analyze the essay I provide for:
  Content:
    The elements of a story:
        Setting (time and place)
        Characters (who are physically described, who engage in actions and dialogue)
    Plot:
    - Exposition
    - Rising action
    - Climax
    - Falling action
    - Resolution


Please grade the following essay written by a child. 
The essay is graded based on the rubric provided. 
Imagine you are an expert English Language teacher working with the Secondary Entrance Assessment curriculum.
This means you teach 10- or 11- year old children. 
The grade should have specific values for Content
Please provide a score out of [10] the criteria.
Please provide suggestions for improvements that the student can make to their essay to achieve a better score.
Format response in Proper JSON Format only, where all properties are double-quoted with this quotation mark, ". 
Use single-quotes around strings. 
Include an property called "Improvements", which will be an array of suggestions for improvement. 

Essay:
  
`;

export const promptLanguage = `Imagine you are an English Language Teacher
  Analyze the essay I provide for:
  Language:
	Descriptive and figurative language that appeal to the readers’ senses and help them to create mental pictures as they read.


Please grade the following essay written by a child. 
The essay is graded based on the rubric provided. 
Imagine you are an expert English Language teacher working with the Secondary Entrance Assessment curriculum.
This means you teach 10- or 11- year old children. 
The grade should have specific values for Content
Please provide a score out of [10] the criteria.
Please provide suggestions for improvements that the student can make to their essay to achieve a better score.
Format response in Proper JSON Format only, where all properties are double-quoted with this quotation mark, ". 
Use single-quotes around strings. 
Include an property called "Improvements", which will be an array of suggestions for improvement. 

Essay:
  
`;

export const promptOrganization = `Imagine you are an English Language Teacher
  Analyze the essay I provide for:
  Organization:
	Sequencing the plot structure so that it does not appear to be jumbled to the reader
    Clearly defined paragraphs
    Transitions that add clarity to the plot structure

Please grade the following essay written by a child. 
The essay is graded based on the rubric provided. 
Imagine you are an expert English Language teacher working with the Secondary Entrance Assessment curriculum.
This means you teach 10- or 11- year old children. 
The grade should have specific values for Content
Please provide a score out of [10] the criteria.
Please provide suggestions for improvements that the student can make to their essay to achieve a better score.
Format response in Proper JSON Format only, where all properties are double-quoted with this quotation mark, ". 
Use single-quotes around strings. 
Include an property called "Improvements", which will be an array of suggestions for improvement. 

Essay:
  
`;

export const promptGrammar = `Imagine you are an English Language Teacher
  Analyze the essay I provide for:
    Grammar/Mechanics:
      1. Capitalization
      2. Parts of speech
      3. Punctuation
      4. Spelling
  
Please grade the following essay written by a child. 
The essay is graded based on the rubric provided. 
Imagine you are an expert English Language teacher working with the Secondary Entrance Assessment curriculum.
This means you teach 10- or 11- year old children. 
The grade should have specific values for Content
Please provide a score out of [10] the criteria.
Please provide suggestions for improvements that the student can make to their essay to achieve a better score.
Format response in Proper JSON Format only, where all properties are double-quoted with this quotation mark, ". 
Use single-quotes around strings. 
Include an property called "Improvements", which will be an array of suggestions for improvement. 

Essay:
  
`;

const promptGuide0 =
`This is a rubric for grading essays includes Content, Language, Organization and Grammar. The rubric is laid out below:

Content:
    The elements of a story:
        Setting (time and place)
        Characters (who are physically described, who engage in actions and dialogue)
    Plot:
    - Exposition
    - Rising action
    - Climax
    - Falling action
    - Resolution

Language:
	Descriptive and figurative language that appeal to the readers’ senses and help them to create mental pictures as they read.


Organization:
	Sequencing the plot structure so that it does not appear to be jumbled to the reader
    Clearly defined paragraphs
    Transitions that add clarity to the plot structure

Grammar/Mechanics:
	1. Capitalization
	2. Parts of speech
	3. Punctuation
	4. Spelling

Essays may have these achievement levels:
	Exemplary: exceeds the standard
	Proficient: meets the minimum standard
	Progressing: nearly meets the standard
	Emerging: below the standard
	Makes an attempt: requires substantial remediation
	Unsatisfactory: requires intervention

Please grade the following essay written by a child. 
The essay is graded based on the rubric provided. 
Imagine you are an expert English Language teacher working with the Secondary Entrance Assessment curriculum.
This means you teach 10- or 11- year old children. 
The grade should have specific values for Content, Language, Organization, Grammar, AchievementLevel
Please provide a score out of [10] for each criteria. 
Please list any grammar errors found in the essay, along with an explanation for each error and a 
proposed correction. 
Finally, please provide suggestions for improvements that the student can make to their essay 
to achieve a better score.
Format response in Proper JSON Format only, where all properties are double-quoted. 
Use single-quotes around strings. 
Include a property called "GrammarErrors" that lists all grammar errors, the explanation for each error and the proposed corrections in an array. 
Include an property called "Improvements", which will be an array of suggestions for improvement. 

Essay:  `;

const promptGuideTemplate = promptGrammar;
export default promptGuideTemplate;
