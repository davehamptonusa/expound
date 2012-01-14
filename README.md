is => maps to writable


isa => $type_name
The isa option uses Moose's type constraint facilities to set up runtime type checking for this attribute. Moose will perform the checks during class construction, and within any accessors. The $type_name argument must be a string. The string may be either a class name or a type defined using Moose's type definition features. (Refer to Moose::Util::TypeConstraints for information on how to define a new type, and how to retrieve type meta-data).

required => (1|0)
This marks the attribute as being required. This means a value must be supplied during class construction, or the attribute must be lazy and have either a default or a builder. Note that c<required> does not say anything about the attribute's value, which can be undef.


lazy => (1|0)??
This will tell the class to not create this slot until absolutely necessary. If an attribute is marked as lazy it must have a default or builder supplied.

trigger => $code
The trigger option is a CODE reference which will be called after the value of the attribute is set. The CODE ref is passed the instance itself, the updated value, and the original value if the attribute was already set.

wrap

handles => ARRAY | HASH | REGEXP | ROLE | ROLETYPE | DUCKTYPE | CODE

builder => Str
The value of this key is the name of the method that will be called to obtain the value used to initialize the attribute. See the builder option docs in Class::MOP::Attribute and/or Moose::Cookbook::Basics::Recipe8 for more information.

default => SCALAR | CODE
The value of this key is the default value which will initialize the attribute.


clearer => Str
Creates a method allowing you to clear the value. See the clearer option docs in Class::MOP::Attribute for more information.

predicate => Str
Creates a method to perform a basic test to see if a value has been set in the attribute. See the predicate option docs in Class::MOP::Attribute for more information.


