import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ClrSignpostAddonComponent } from './signpost.component';
import { ClarityModule } from '@clr/angular';

describe('SignpostComponent', () => {
  let component: ClrSignpostAddonComponent;
  let fixture: ComponentFixture<ClrSignpostAddonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClrSignpostAddonComponent],
      imports: [ClarityModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ClrSignpostAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent click propagation inside signpost content', fakeAsync(() => {
    component.open = true;
    fixture.detectChanges();
    tick();

    const signpostContent = fixture.nativeElement.querySelector('.signpost-content');
    expect(signpostContent).toBeTruthy();

    let clickReachedDocument = false;
    const documentClickHandler = () => {
      clickReachedDocument = true;
    };

    document.addEventListener('click', documentClickHandler);

    signpostContent.click();

    // If propagation was stopped, the document listener should not be called
    expect(clickReachedDocument).toBe(false);

    document.removeEventListener('click', documentClickHandler);
  }));

  it('should allow close button clicks to propagate', fakeAsync(() => {
    component.open = true;
    fixture.detectChanges();
    tick();

    const closeButton = fixture.nativeElement.querySelector('.signpost-action.close');

    if (closeButton) {
      let clickReachedDocument = false;
      const documentClickHandler = () => {
        clickReachedDocument = true;
      };

      document.addEventListener('click', documentClickHandler);

      closeButton.click();

      expect(clickReachedDocument).toBe(true);

      document.removeEventListener('click', documentClickHandler);
    }
  }));

  it('should move signpost content to target anchor when specified', fakeAsync(() => {
    const targetElement = document.createElement('div');
    targetElement.classList.add('target-container');
    document.body.appendChild(targetElement);

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    targetElement.appendChild(wrapper);
    wrapper.appendChild(fixture.nativeElement);

    component.targetAnchor = '.target-container';
    component.open = true;
    fixture.detectChanges();
    tick();

    const signpostContent = document.querySelector('.signpost-content');

    // Verify the signpost content was moved directly under targetElement, not under wrapper
    expect(signpostContent?.parentElement).toBe(targetElement);
    expect(signpostContent?.parentElement).not.toBe(wrapper);

    document.body.removeChild(targetElement);
  }));
});
