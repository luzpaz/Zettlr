/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        Keymap
 * CVM-Role:        Extension
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     This is our base keymap.
 *
 * END HEADER
 */

import { acceptCompletion } from '@codemirror/autocomplete'
import { copyLineDown, copyLineUp, indentLess, indentMore, moveLineDown, moveLineUp } from '@codemirror/commands'
import { KeyBinding } from '@codemirror/view'
import { abortSnippet, nextSnippet } from '../autocomplete/snippets'
import { copyAsHTML, paste, pasteAsPlain } from '../util/copy-paste-cut'
import { handleReplacement, handleBackspace, handleQuote } from './autocorrect'
import { addNewFootnote } from './footnotes'
import { maybeIndentList, maybeUnindentList } from './lists'
import { insertLink, insertImage, applyBold, applyItalic, applyComment, applyTaskList } from './markdown'

// Custom keymap implementing less complex keyboard shortcuts
export const customKeymap: KeyBinding[] = [
  { key: 'Mod-k', run: insertLink },
  { key: 'Mod-Alt-i', run: insertImage },
  { key: 'Mod-b', run: applyBold },
  { key: 'Mod-i', run: applyItalic },
  { key: 'Mod-Shift-c', run: applyComment },
  { key: 'Mod-Alt-r', run: addNewFootnote },
  { key: 'Tab', run: nextSnippet },
  { key: 'Tab', run: acceptCompletion },
  { key: 'Tab', run: maybeIndentList, shift: maybeUnindentList },
  { key: 'Tab', run: indentMore, shift: indentLess },
  { key: 'Esc', run: abortSnippet },
  { key: 'Space', run: handleReplacement },
  { key: 'Enter', run: handleReplacement },
  { key: 'Backspace', run: handleBackspace },
  { key: 'Alt-Up', run: moveLineUp, shift: copyLineUp },
  { key: 'Alt-Down', run: moveLineDown, shift: copyLineDown },
  { key: 'Mod-t', run: applyTaskList },
  { key: 'Mod-v', run: view => { paste(view); return true }, shift: view => { pasteAsPlain(view); return true } },
  { key: 'Mod-Alt-c', run: view => { copyAsHTML(view); return true } },
  { key: '"', run: handleQuote('"') },
  { key: "'", run: handleQuote("'") },
  // DEBUG: We have to add handlers that specifically listen for the German
  // a-umlaut characters, because they have the same keycode as the quote key on
  // us-ANSI layouts (222). If we omit the following two listeners, German users
  // won't be able to insert an a-umlaut and instead produce many quotes.
  // DEBUG: This also happens with literally any other keyboard layout. The
  // Swedish layout works, since it has an a-umlaut at the same position, but
  // the Russian `э`-key, for example, still produces the same behavior.
  // SEE THIS ISSUE: https://github.com/codemirror/dev/issues/1001
  { key: 'ä', run: view => { view.dispatch(view.state.replaceSelection('ä')); return true } },
  { key: 'Ä', run: view => { view.dispatch(view.state.replaceSelection('Ä')); return true } }
]
