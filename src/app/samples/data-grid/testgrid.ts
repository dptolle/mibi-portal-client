import { Component, OnInit, HostListener } from '@angular/core';

interface DataGridCell {
    row: number;
    col: number;
}

class DataGridActiveCell implements DataGridCell {
    row: number;
    col: number;

    constructor() {
        this.clear();
    }

    set(row: number, col: number): void {
        this.row = row;
        this.col = col;
    }

    clear(): void {
        this.row = -1;
        this.col = -1;
    }

    isActiveCell(row: number, col: number): boolean {
        return this.row === row && this.col === col;
    }

    isActive(): boolean {
        return !this.isActiveCell(-1, -1);
    }
}

class DataGridSelectionController {
    readonly anchor = new DataGridActiveCell();
    private selection: DataGridCell[] = [];

    isSelected(row: number, col: number): boolean {
        return !!this.selection.find(v => v.row === row && v.col === col);
    }

    clear(): void {
        this.anchor.clear();
        this.selection = [];
    }

    doSelection(): boolean {
        return this.anchor.isActive();
    }

    start(row: number, col: number, rows: number, cols: number): void {
        this.anchor.set(row, col);
        this.select(row, col, rows, cols);
    }

    select(row: number, col: number, rows: number, cols: number): void {
        const c1 = this.anchor.col;
        const r1 = this.anchor.row;
        let c2 = c1 + (col - c1);
        let r2 = r1 + (row - r1);
        if (c1 === 0) {
            c2 = cols - 1;
        }
        if (r1 === 0) {
            r2 = rows - 1;
        }

        this.selection = [];

        for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
            for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
                this.selection.push({ row: r, col: c });
            }
        }
    }
}

// // to interface?
// class BluredState {
//     public restoreStateOnWindowBlur = false;
//     public cursor = new DataGridActiveCell();
// }

class DataGridBlurController {
    private bluredElement: EventTarget | null = null;

    blur(e: FocusEvent): void {
        this.log('blur');
        this.bluredElement = e.target;
    }

    clear(): void {
        this.log('clear');
        this.bluredElement = null;
    }

    isBlured(): boolean {
        return this.bluredElement !== null;
    }

    refocus(): void {
        this.log('tryrefocus');
        if (this.bluredElement) {
            (this.bluredElement as any).focus();
            this.log('refocus');
        }
    }
}

@Component({
    selector: 'mibi-test-grid',
    templateUrl: './testgrid.html',
    styleUrls: ['./testgrid.scss']
})
export class TestGridComponent implements OnInit {

    private readonly MOUSE_BUTTON_PRIMARY = 0;
    private readonly MOUSE_BUTTONS_PRIMARY = 1;

    private readonly HEADER_ROW = 0;
    private readonly HEADER_COL = 0;

    // readonly focus = new DataGridActiveCell();
    readonly cursor = new DataGridActiveCell();
    readonly editor = new DataGridActiveCell();
    readonly selection = new DataGridSelectionController();
    // readonly blurer = new DataGridBlurController();

    // private readonly bluredState = new BluredState();

    testData: string[][];
    n = 10;

    clipboard: string;

    bluredSelection: { row: number, col: number }[] = [];
    bluredEditableRow = -1;
    bluredEditableCol = -1;
    ownDown: boolean = false;

    preventInput = false;
    preventClear = false;

    constructor() {
        this.testData = [];
        for (let i = 0; i < 100; i++) {
            this.testData.push([]);
            for (let j = 0; j < 10; j++) {
                this.testData[i].push('testData ' + i.toString() + ' ' + j.toString());
            }
        }

        window.addEventListener('blur', () => {
            this.log('blur window');
            // // this.selected = this.bluredSelection;
            // // this.editableRow = this.bluredEditableRow;
            // // this.editableCol = this.bluredEditableCol;

            // // restore blured state if a user clicks outside the window
            // if(this.bluredState.restoreStateOnWindowBlur){
            //     this.cursor.set(this.bluredState.cursor.row, this.bluredState.cursor.col);
            // }
        });

        window.addEventListener('focus', e => {
            this.log('focus window');

            // this.preventInput = true;
        });

        window.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button !== this.MOUSE_BUTTON_PRIMARY) {
                return;
            }

            this.log('mousedown window');

            if (!this.preventClear) {
                this.editor.clear();
                this.cursor.clear();
                this.selection.clear();
            } else {
                this.preventClear = false;
            }

            // if(this.preventInput) {
            //     e.preventDefault();
            // }
            // // if cell blur was caused by a user clicking outside the data-grid
            // // do not restore the state on next window blur event
            // this.bluredState.restoreStateOnWindowBlur = false;
        });
    }

    ngOnInit(): void {

    }

    // Focus

    handleOverlayFocus(e: FocusEvent, row: number, col: number): void {
        this.log('focus overlay ' + row + ' ' + col);

        // this.blurer.clear();

        // if(this.focus.isActiveCell(row, col)){
        //     return;
        // }

        // this.focus.set(row, col);
    }

    handleOverlayBlur(e: FocusEvent, row: number, col: number): void {
        this.log('blur overlay' + row + ' ' + col);

        // this.blurer.blur(e);

        return;

        this.cursor.clear();

        if (this.selection.anchor.isActiveCell(row, col)) {
            this.selection.clear();
        }

        return;

        // OLD CODE
        // // if blur was not caused by clicking outside the data-grid then save the state
        // // to restore it if the user clicked outside the browser window
        // if (this.bluredState.restoreStateOnWindowBlur) {
        //     // this.bluredSelection = this.selected;
        //     // this.bluredEditableRow = this.editableRow;
        //     // this.bluredEditableCol = this.editableCol;
        //     this.bluredState.cursor.set(this.cursor.row, this.cursor.col);
        // }
        // else {
        //     // this.bluredSelection = [];
        //     // this.bluredEditableRow = -1;
        //     // this.bluredEditableCol = -1,
        //     this.bluredState.cursor.clear();
        // }

        // this.bluredState.cursor.set(this.cursor.row, this.cursor.col);
    }

    handleEditorFocus(e: FocusEvent, row: number, col: number): void {
        this.log('focus editor');

        // this.blurer.clear();
    }

    handleEditorBlur(e: FocusEvent, row: number, col: number): void {
        this.log('blur editor');

        // this.blurer.blur(e);

        // this.editor.clear();
    }

    // Click

    handleOverlayClick(e: MouseEvent, row: number, col: number): void {
        if (e.button !== this.MOUSE_BUTTON_PRIMARY) {
            return;
        }

        this.log('click overlay ' + row + ' ' + col);

        // if(this.blurer.isBlured()){
        //     return;
        // }

        if (this.preventInput) {
            return;
        }

        if (this.isHeader(row, col)) {
            return;
        }

        // editor -> editor
        if (this.editor.isActiveCell(row, col)) {
            return;
        }

        // cursor -> editor
        if (this.cursor.isActiveCell(row, col)) {
            this.cursor.clear();
            this.selection.clear();
            this.editor.set(row, col);
            return;
        }

        // void -> cursor {
        this.cursor.set(row, col);
    }

    handleGridClick(e: MouseEvent) {
        if (e.button !== this.MOUSE_BUTTON_PRIMARY) {
            return;
        }

        this.log('click grid');

        // if(this.blurer.isBlured()) {
        //     this.blurer.refocus();
        // }
        if (this.preventInput) {
            this.preventInput = false;
        }
    }

    // MouseDown

    handleOverlayMouseDown(e: MouseEvent, row: number, col: number): void {
        if (e.button !== this.MOUSE_BUTTON_PRIMARY) {
            return;
        }

        this.log('mousedown overlay ' + row + ' ' + col);

        // clear any selected elements not part of the grid to prevent drag and drop behaviour
        const sel = window.getSelection();
        if (sel) {
            sel.empty();
        }

        // if(this.blurer.isBlured()){
        //     // prevent focus
        //     e.preventDefault();
        //     return;
        // }

        if (this.preventInput) {
            // if(!this.editor.isActiveCell(row, col)){
            //     e.preventDefault();
            // }
            return;
        }

        // editor -> editor
        if (this.editor.isActiveCell(row, col)) {
            return;
        }

        this.editor.clear();

        if (!this.cursor.isActiveCell(row, col)) {
            this.cursor.clear();
        }

        // -> selection start
        this.selection.start(row, col, this.testData.length, this.testData[0].length);

        return;

        // during click event (mouseup on same cell) the cursor is set again
        // this.cursor.clear();

        // keep state to restore it if user clicks outside the browser window
        // this.bluredState.restoreStateOnWindowBlur = true;
        // prevent window from firing mousedown (window only fires (and clears state) if the user clicks outside the data-grid)
        e.stopImmediatePropagation();
        // e.preventDefault();
    }

    handleGridMouseDown(e: MouseEvent) {
        if (e.button !== this.MOUSE_BUTTON_PRIMARY) {
            return;
        }

        this.log('mousedown grid');

        this.preventClear = true;

        // if(this.preventInput) {
        //     e.preventDefault();
        // }

        // if(this.bluredElement) {
        //     e.preventDefault();
        //     e.stopImmediatePropagation();
        // }
    }

    // MouseOver

    // SELECTION
    handleOverlayMouseOver(e: MouseEvent, row: number, col: number): void {
        if (e.buttons !== this.MOUSE_BUTTONS_PRIMARY) {
            return;
        }

        this.log('mouseover overlay');

        // if(this.blurer.isBlured()){
        //     return;
        // }

        if (this.preventInput) {
            return;
        }

        if (this.selection.doSelection()) {
            this.cursor.clear();
            this.selection.select(row, col, this.testData.length, this.testData[0].length);
        }
    }

    // OLD

    logPaste(e: ClipboardEvent): void {
        this.log('paste: ' + e.target);
    }

    logText(text: string): void {
        this.log(text);
    }

    doCopy(ev: ClipboardEvent, row: number, col: number): void {
        // this.log('copy' + row + ' ' + col);
        // this.log(this.editableRow + ' ' + this.editableCol);
        // if (this.editableRow !== -1) {
        //     return;
        // }
        // ev.preventDefault();
        // this.clipboard = "";
        // let lastRow = -1;
        // for (var i = 0; i < this.selected.length; i++) {
        //     if (i != 0) {
        //         if (lastRow !== this.selected[i].row) {
        //             this.clipboard += '\n';
        //         }
        //         else {
        //             this.clipboard += '\t';
        //         }
        //     }
        //     lastRow = this.selected[i].row;
        //     this.clipboard += '"' + this.testData[this.selected[i].row][this.selected[i].col] + '"';
        // }

        // if (ev.clipboardData) {
        //     ev.clipboardData.setData("text", this.clipboard);
        // }
    }

    forceFocus(e: MouseEvent): void {
        if (e.target) {
            (e.target as any).focus();
        }
    }

    // Utility

    isRowHeader(row: number): boolean {
        return row === this.HEADER_ROW;
    }

    isColHeader(col: number): boolean {
        return col === this.HEADER_COL;
    }

    isHeader(row: number, col: number): boolean {
        return this.isRowHeader(row) || this.isColHeader(col);
    }

    @HostListener('paste', ['$event'])
    handle(e: ClipboardEvent): void {
        if (e.clipboardData) {
            e.clipboardData.setData('text', 'test');
            this.log(e.clipboardData.getData('text'));
        }
    }

    private log(text: string) {
        // console.log(text);
    }
}
