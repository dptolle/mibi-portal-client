import { Component, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
    selector: 'mibi-test-comp',
    templateUrl: './testcomp.html',
    styleUrls: ['./testcomp.scss']
})
export class TestComponent implements OnInit {

    @Output() onBlur = new EventEmitter<FocusEvent>();
    @Output() onFocus = new EventEmitter<FocusEvent>();

    @ViewChild('editor', { static: true })
    private editor: ElementRef;

    ngOnInit(): void {
        this.editor.nativeElement.focus();
    }

    handleBlur(e: FocusEvent): void {
        this.onBlur.emit(e);
    }

    handleFocus(e: FocusEvent): void {
        this.onFocus.emit(e);
    }

    logText(text: string): void {
        this.log(text);
    }

    private log(text: string) {
        // console.log(text);
    }
}
